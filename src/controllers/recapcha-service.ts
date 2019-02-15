import Request from '../request/recapcha-request';
import { HttpError, HttpStatusCode } from '../utils/httperror';

export default class RecapchaService {
    private request: Request
    constructor() {
        this.request = new Request()
    }

    async verifyRecapcha(token: string, remoteip: string, score: number) {
        let result = await this.request.verifyRecaptcha(token, remoteip)
        if (!result.success) {
            throw new HttpError("recapcha verified failed", HttpStatusCode.Forbidden)
        }
        if (result.score < score) {
            throw new HttpError("recapcha score too low", HttpStatusCode.Forbidden)
        }
    }
}