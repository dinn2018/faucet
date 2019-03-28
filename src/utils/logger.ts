import * as log4js from 'log4js';

log4js.configure({
    appenders: {
        "out": { type: 'stdout', layout: { type: "basic" } },
        "err": { type: 'stderr', layout: { type: "basic" } },
        "just-error": { type: 'logLevelFilter', appender: 'err', level: 'error' },
        "just-info": { type: 'logLevelFilter', appender: 'out', level: 'trace', maxLevel: 'warn' }
    },
    categories: {
        "default": { level: "trace", appenders: ["just-info", "just-error"] }
    }
});

const logger = log4js.getLogger('FAUCET');
const reportLogger = log4js.getLogger('FAUCET-REPORT');


export {
    logger,
    reportLogger
}
