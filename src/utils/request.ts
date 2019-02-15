import * as request from 'request-promise'
import { Address } from 'thor-model-kit';
export default class Request {
    private testNetAPIAddr: string
    constructor(testNetAPIAddr: string) {
        this.testNetAPIAddr = testNetAPIAddr
    }
    async bestBlock() {
        try {
            const opt = {
                method: "GET",
                uri: this.testNetAPIAddr + "/blocks/best",
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
                uri: this.testNetAPIAddr + "/transactions",
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
                uri: this.testNetAPIAddr + "/accounts/" + addr.toString(),
                json: true
            }
            return request(opt)
        } catch (err) {
            throw err
        }
    }
}