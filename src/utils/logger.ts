import * as log4js from 'log4js';

log4js.configure({
    appenders: {
        "info": {
            type: 'file',
            filename: 'logs/faucetInfo.log'
        },
        "error": {
            type: 'file',
            filename: 'logs/faucetError.log'
        }
    },
    categories: {
        "default": { level: "info", appenders: ["info"] },
        "info": { level: "info", appenders: ["info"] },
        "error": { level: "info", appenders: ["error"] },
    }
});

const iLog = log4js.getLogger('info');
const eLog = log4js.getLogger('error');

export {
    iLog,
    eLog
}
