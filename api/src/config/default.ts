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
    port: 8100,
    specFilePath: './spec.yaml',
    mongo: {
        connectionString: 'mongodb://localhost:27017/mfb',
        options: {}
    },
    token: {
        secret: 'FVSXhgPolUDtYnDgmcV1V1aYJMpwjasFf2wejFFP'
    },
    sms: {
        enabled: false,
        senderPhoneNumber: '+16466812929',
        apikey: {
            SID: 'AC0c6089c71447fc5f578f370af0b4df26',
            Token: '51fb46db9a7cc9b87777b053a11c14c1'
        }
    },
    user: {
        welcomeMessageText: 'Please install the application to access Mobile First Branch https://bit.ly/2jNpKA1'
    }
};