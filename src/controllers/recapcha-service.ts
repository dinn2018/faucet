import RecapchaRequest from '../request/recapcha-request';
import { HttpError, HttpStatusCode } from '../utils/httperror';
import Config from '../utils/config';

export default class RecapchaService {
    private request: RecapchaRequest
    private config: Config

    constructor(config: Config) {
        this.config = config
        this.request = new RecapchaRequest(config.recapchaSecretKey)
    }

    async verifyRecapcha(token: string, remoteip: string) {
        let result = await this.request.verifyRecaptcha(token, remoteip)
        if (!result.success) {
            throw new HttpError("recapcha verified failed", HttpStatusCode.Forbidden)
        }
        if (result.score < this.config.recapchaMaxScore) {
            throw new HttpError("recapcha score too low", HttpStatusCode.Forbidden)
        }
    }
}