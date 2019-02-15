import * as request from 'request-promise'
import { Address } from 'thor-model-kit';
export default class FaucetRequest {
    private networkAPIAddr: string
    constructor(networkAPIAddr: string) {
        this.networkAPIAddr = networkAPIAddr
    }
    async bestBlock() {
        try {
            const opt = {
                method: "GET",
                uri: this.networkAPIAddr + "/blocks/best",
                json: true
            }
            return request(opt)
        } catch (err) {
            throw err
        }
    }
    async sendTx(data: Buffer) {
        try {
            const opt = {
                method: "POST",
                uri: this.networkAPIAddr + "/transactions",
                body: {
                    raw: "0x" + data.toString("hex")
                },
                json: true
            }
            return request(opt)
        } catch (err) {
            throw err
        }
    }

    async getAccount(addr: Address) {
        try {
            const opt = {
                method: "GET",
                uri: this.networkAPIAddr + "/accounts/" + addr.toString(),
                json: true
            }
            return request(opt)
        } catch (err) {
            throw err
        }
    }

}