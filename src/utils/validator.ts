import { HttpError, ErrorType, HttpStatusCode } from './httperror';
import { Certificate } from 'thor-devkit'
import { Address } from 'thor-model-kit'
// import { loggerError } from '../utils/logger'

export default class Validator {
    static validateTimestamp(timestamp: number, expiration: number) {
        if (Date.now() / 1000 - timestamp > expiration) {
            // loggerError("certificate expired", "now:" + Date.now() / 1000, "timestamp:" + timestamp)
            throw new HttpError("certificate expired", ErrorType.Certificate_Expired, HttpStatusCode.Forbidden)
        }
    }

    static validateCertificate(cert: Certificate) {
        try {
            Certificate.verify(cert)
        } catch (err) {
            // loggerError("certificate verified failed", err)
            throw new HttpError("certificate verified failed", ErrorType.Certificate_Verified_Failed, HttpStatusCode.Forbidden)
        }
    }

    static validateAddress(a: string) {
        let addr;
        try {
            addr = Address.fromHex(a);
        } catch (err) {
            // loggerError("signer: invalid address", err)
            throw new HttpError("signer: invalid address" + a, ErrorType.Parameter_Address, HttpStatusCode.BadRequest)
        }
        return addr
    }
}