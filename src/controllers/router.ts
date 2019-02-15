import * as Router from 'koa-router';
import Cert from '../utils/cert'
import Service from './service'
import Validator from '../utils/validator'
var router = new Router();

router.post("/requests", async (ctx) => {
    try {
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
        let service = new Service(ctx.db, ctx.config)
        await service.balanceApproved()
        await service.addressApproved(addr)
        await service.ipApproved(remoteAddr)
        let tx = await service.buildTx(addr)
        await service.txApproved(tx.id)
        await service.insertTx(tx.id, addr, remoteAddr)
        await service.send(tx)
        ctx.body = {
            id: tx.id.toString()
        };
    } catch (err) {
        throw err
    }
});

export default router;