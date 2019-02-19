import * as request from 'request-promise'
import { Address } from 'thor-model-kit';
import { HttpError, ErrorType, HttpStatusCode } from '../utils/httperror';

export default class ThorAPI {
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
            throw new HttpError(err.message, ErrorType.Internal_Error, HttpStatusCode.InternalError)
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
            throw new HttpError(err.message, ErrorType.Internal_Error, HttpStatusCode.InternalError)
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
            throw new HttpError(err.message, ErrorType.Internal_Error, HttpStatusCode.InternalError)
        }
    }

}