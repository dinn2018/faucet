import RecapchaAPI from '../api/recapcha-api';
import { HttpError, HttpStatusCode } from '../utils/httperror';
import Config from '../utils/config';

export default class RecapchaService {
    private recapchaAPI: RecapchaAPI
    private config: Config

    constructor(config: Config) {
        this.config = config
        this.recapchaAPI = new RecapchaAPI(config.recapchaSecretKey)
    }

    async verifyRecapcha(token: string) {
        let result = await this.recapchaAPI.verifyRecaptcha(token)
        if (!result.success) {
            throw new HttpError("recapcha verified failed", HttpStatusCode.Forbidden)
        }
        if (result.score < this.config.recapchaMinScore) {
            throw new HttpError("recapcha score too low", HttpStatusCode.Forbidden)
        }
    }
}