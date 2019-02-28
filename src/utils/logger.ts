import * as log4js from 'log4js';

log4js.configure({
    appenders: {
        "out": {type: 'stdout'},
        "err": { type: 'stderr'},
        "just-error": { type: 'logLevelFilter', appender: 'err', level: 'error' },
        "just-info": { type: 'logLevelFilter', appender: 'out', level: 'trace', maxLevel: 'warn' }
    },
    categories: {
        "default": { level: "trace", appenders: ["just-info", "just-error"] }
    }
});

const logger = log4js.getLogger('FAUCET');

export {
    logger
}
