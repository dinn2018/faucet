export default class Cert {
    domain: string;
    payload: {
        type: string;
        content: string;
    };
    purpose: string;
    signer: string;
    timestamp: number;
    signature: string;
    constructor(domain: string, timestamp: number, signer: string, signature: string, purpose: string, payload_type: string, payload_content: string) {
        this.domain = domain
        this.timestamp = timestamp
        this.signer = signer
        this.signature = signature
        this.purpose = purpose
        this.payload = {
            type: payload_type,
            content: payload_content
        }
    }
}