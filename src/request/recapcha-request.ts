import * as request from 'request-promise'
export default class RecapchaRequest {
    async verifyRecaptcha(token: string, remoteip: string) {
        try {
            const opt = {
                method: "POST",
                uri: "https://www.google.com/recaptcha/api/siteverify",
                body: {
                    secret: "6LfLo5EUAAAAABieOCITjtA_3jZUauesui7uXa53",
                    response: token,
                    remoteip: remoteip
                },
                json: true
            }
            return request(opt)
        } catch (err) {
            throw err
        }
    }
}