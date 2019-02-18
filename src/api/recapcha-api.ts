import * as request from 'request-promise'
export default class RecapchaAPI {
    private secret: string
    constructor(secret: string) {
        this.secret = secret
    }
    async verifyRecaptcha(token: string) {
        try {
            const opt = {
                method: "GET",
                uri: "https://www.google.com/recaptcha/api/siteverify?secret=" + this.secret + "&&" + "response=" + token,
                json: true
            }
            return request(opt)
        } catch (err) {
            throw err
        }
    }
}