
export class HttpError extends Error {
    message: string
    statusCode: HttpStatusCode
    constructor(message: string, statusCode: HttpStatusCode) {
        super(message)
        this.statusCode = statusCode
    }

}

export enum HttpStatusCode {
    BadRequest = 400,
    Forbidden = 403,
    InternalError = 500
}