import DB from '../utils/db';
import { Address, Transaction, BigInt, Secp256k1, Bytes32, keccak256 } from 'thor-model-kit';
import { abi } from 'thor-devkit'
import ThorAPI from '../api/thor-api';
import Config from '../utils/config';
import { iLog, eLog } from '../utils/logger'
import { HttpError, ErrorType, HttpStatusCode } from '../utils/httperror';
import BigNumber from 'bignumber.js';

export default class TransactionService {
    private db: DB
    private thorAPI: ThorAPI
    private config: Config
    constructor(db: DB, config: Config) {
        this.db = db
        this.thorAPI = new ThorAPI(config.networkAPIAddr)
        this.config = config
    }

    async certHashApproved(certHash: Buffer) {
        let results = await this.db.query("select ifnull(count(*),0) as count from faucet where certhash = ?;", certHash)
        if (results.length > 0 && results[0].count >= this.config.maxAddressTimes) {
            eLog.error("this certificate has already been used", "cert hash", certHash.toString("hex"))
            throw new HttpError("this certificate has already been used", ErrorType.Certificate_Expired, HttpStatusCode.Forbidden)
        }
    }

    async balanceApproved() {
        let acc = await this.thorAPI.getAccount(this.config.addr)
        let balance = new BigNumber(acc.balance)
        let eng = new BigNumber(acc.eng)
        if (balance.isLessThan(this.config.vetLimit)) {
            eLog.error(`insufficient vet`, balance, this.config.vetLimit)
            throw new HttpError(`insufficient vet`, ErrorType.Insufficient_Vet, HttpStatusCode.Forbidden)
        }
        if (eng.isLessThan(this.config.engLimit)) {
            eLog.error(`insufficient energy`, eng, this.config.engLimit)
            throw new HttpError(`insufficient energy`, ErrorType.Insufficient_Eng, HttpStatusCode.Forbidden)
        }
    }

    async addressApproved(to: Address) {
        try {
            let results = await this.db.query("select ifnull(count(*),0) as count,strftime('%Y-%m-%d',createtime,'unixepoch') from faucet where strftime('%Y-%m-%d',createtime,'unixepoch') = date('now') and address = ? group by strftime('%Y-%m-%d', createtime, 'unixepoch');", to.bytes)
            if (results.length > 0 && results[0].count >= this.config.maxAddressTimes) {
                eLog.error(`rateLimit Exceed, one address can only send ${this.config.maxAddressTimes} requests one day`, "count:" + results[0].count)
                throw new HttpError(`rateLimit Exceed, one address can only send ${this.config.maxAddressTimes} requests one day`, ErrorType.Address_RateLimit_Exceed, HttpStatusCode.Forbidden)
            }
        } catch (err) {
            throw err
        }
    }

    async ipApproved(remoteAddr: string) {
        try {
            let results = await this.db.query("select ifnull(count(*),0) as count from faucet where strftime('%Y-%m-%d',createtime,'unixepoch') = date('now') and remoteAddr = ? group by strftime('%Y-%m-%d',createtime,'unixepoch')", Buffer.from(remoteAddr))
            if (results.length > 0 && results[0].count >= this.config.maxRemoteaddrTimes) {
                eLog.error(`rateLimit Exceed, one ip address can only send ${this.config.maxRemoteaddrTimes} requests one day`, "count:" + results[0].count)
                throw new HttpError(`rateLimit Exceed, one ip address can only send ${this.config.maxRemoteaddrTimes} requests one day`, ErrorType.IP_RateLimit_Exceed, HttpStatusCode.Forbidden)
            }
        } catch (err) {
            throw err
        }
    }

    async txApproved(txid: Bytes32) {
        try {
            let results = await this.db.query("select ifnull(count(*),0) as count from faucet where txid = ?;", txid.bytes)
            if (results.length > 0 && results[0].count > 0) {
                eLog.error("transaction is pending")
                throw new HttpError("transaction is pending", ErrorType.Exist_Transaction, HttpStatusCode.Forbidden)
            }
        } catch (err) {
            throw err
        }
    }

    async insertTx(txid: Bytes32, to: Address, remoteAddr: string, certHash: Buffer) {
        try {
            await this.db.exec("INSERT INTO faucet (txid, address, vet, thor, remoteAddr, createtime,certhash) VALUES (?, ?, ?, ?, ?, ?, ?);",
                txid.bytes,
                to.bytes,
                Buffer.from(this.config.vet.toString()),
                Buffer.from(this.config.thor.toString()),
                Buffer.from(remoteAddr),
                Date.now() / 1000,
                certHash)
        } catch (err) {
            eLog.error("insertTx", err)
            throw err
        }
    }

    async buildTx(to: Address) {
        try {
            let coder = new abi.Function({ "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" })
            let data = coder.encode(to.toString(), this.config.thor)
            let clauses = [{
                to: to,
                value: BigInt.from(this.config.vet),
                data: Buffer.alloc(0)
            }, {
                to: Address.fromHex('0x0000000000000000000000000000456e65726779'),
                value: BigInt.from(0),
                data: Buffer.from(data.slice(2), "hex")
            }]
            let bestBlock = await this.thorAPI.bestBlock()
            let nonce = Math.floor(Math.random() * (2 >> 32))
            let body: Transaction.Body = {
                chainTag: this.config.chainTag,
                blockRef: Buffer.from(bestBlock.id.slice(2, 18), "hex"),
                expiration: 32,
                clauses: clauses,
                gasPriceCoef: 255,
                gas: BigInt.from(100000),
                dependsOn: null,
                nonce: BigInt.from(nonce),
                reserved: []
            }
            let tx = new Transaction(body)
            tx.signature = Secp256k1.sign(tx.signingHash, Bytes32.fromHex(this.config.privateKey))
            return tx
        } catch (err) {
            eLog.error("buildTx err", err)
            throw err
        }
    }
    async send(tx: Transaction) {
        try {
            let raw = tx.encode()
            await this.thorAPI.sendTx(raw)
        } catch (err) {
            eLog.error("sent tx err", err)
            throw err
        }
    }
}
