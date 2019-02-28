import RecapchaAPI from '../api/recapcha-api';
import { HttpError, ErrorType, HttpStatusCode } from '../utils/httperror';
import Config from '../utils/config';
import { logger } from '../utils/logger'

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
            logger.error("recapcha verified failed", result)
            throw new HttpError("recapcha verified failed", ErrorType.Recapcha_Verified_Failed, HttpStatusCode.Forbidden)
        }
        if (result.score < this.config.recapchaMinScore) {
            logger.error("recapcha score too low", result, "min score", this.config.recapchaMinScore)
            throw new HttpError("recapcha score too low", ErrorType.Recapcha_Low_Score, HttpStatusCode.Forbidden)
        }
        return result.score
    }
}