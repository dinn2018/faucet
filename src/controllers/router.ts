import * as Router from 'koa-router';
import Cert from '../utils/cert'
import TransactionService from './transaction-service'
import RecapchaService from './recapcha-service'
import Validator from '../utils/validator'
import { keccak256 } from 'thor-devkit/dist/cry';

var router = new Router();
router.post("/requests", async (ctx) => {
    try {
        let recapchaService = new RecapchaService(ctx.config)
        await recapchaService.verifyRecapcha(ctx.request.body.token)
        let domain = ctx.request.body.annex.domain
        let signer = ctx.request.body.annex.signer
        let timestamp = parseFloat(ctx.request.body.annex.timestamp)
        let signature = ctx.request.body.signature
        let purpose = ctx.request.body.purpose
        let type = ctx.request.body.payload.type
        let content = ctx.request.body.payload.content
        let cert = new Cert(domain, timestamp, signer, signature, purpose, type, content)
        Validator.validateTimestamp(timestamp, ctx.config.certificateExpiration)
        Validator.validateCertificate(cert)
        let addr = Validator.validateAddress(signer)
        let remoteAddr = ctx.request.ip;
        let service = new TransactionService(ctx.db, ctx.config)
        let certHash = keccak256(JSON.stringify(cert))
        await service.certHashApproved(certHash)
        await service.balanceApproved()
        await service.addressApproved(addr)
        await service.ipApproved(remoteAddr)
        let tx = await service.buildTx(addr)
        await service.txApproved(tx.id)
        await service.insertTx(tx.id, addr, remoteAddr, certHash)
        await service.send(tx)
        ctx.body = {
            id: tx.id.toString()
        };
    } catch (err) {
        throw err
    }
});

export default router;