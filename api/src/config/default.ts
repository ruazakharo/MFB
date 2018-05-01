export = {
    queue: {
        windows: ['1', '2', '3'],
        refreshInterval: 500,
        fillQueueSize: 7,
        minServiceTime: 10 * 1000,
        maxServiceTime: 30 * 1000
    },
    logging: {
        appenders: {
            out: {
                type: 'console'
            },
            file: {
                type: 'dateFile',
                filename: './logs/api.log',
                pattern: '-yyyy-MM-dd'
            }
        },
        replaceConsole: true,
        categories: {
            default: {
                appenders: ['out', 'file'],
                level: 'ALL'
            }
        }
    },
    port: 8000,
    specFilePath: './spec.yaml',
    mongo: {
        connectionString: 'mongodb://localhost:27017/botf',
        options: {}
    },
    token: {
        secret: 'FVSXhgPolUDtYnDgmcV1V1aYJMpwjasFf2wejFFP'
    }
};