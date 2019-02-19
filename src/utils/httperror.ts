
class HttpError extends Error {
    message: string
    type: ErrorType
    statusCode: HttpStatusCode
    constructor(message: string, errType: ErrorType, statusCode: HttpStatusCode) {
        super(message)
        this.statusCode = statusCode
        this.type = errType
    }

}

enum HttpStatusCode {
    BadRequest = 400,
    Forbidden = 403,
    InternalError = 500
}

enum ErrorType {
    Internal_Error = 100,
    Parameter_Address = 200,
    Recapcha_Verified_Failed = 300,
    Recapcha_Low_Score = 301,
    Certificate_Expired = 400,
    Certificate_Verified_Failed = 401,
    Insufficient_Vet = 402,
    Insufficient_Eng = 403,
    Address_RateLimit_Exceed = 404,
    IP_RateLimit_Exceed = 405,
    Exist_Transaction = 406,
}

export {
    HttpError,
    HttpStatusCode,
    ErrorType
}