process.chdir(__dirname);

import * as Express from 'express';
import * as Http from 'http';
import * as Log4js from 'log4js';
import * as Config from 'config';

import * as CommonMiddleware from './middleware/common';
import { errorHandler as ErrorHandler } from './middleware/error-handler';
import { sendResponseFromPromise as SendPromisedResponse } from './middleware/response-promise';

import * as Mongo from './db/mongo';

import * as AppointmentQueueService from './services/AppointmentQueueService';

Log4js.configure(Config.get<Log4js.Configuration>('logging'));
const logger = Log4js.getLogger('server.core');

export const app = Express();

CommonMiddleware.logger(app);
CommonMiddleware.cors(app);
CommonMiddleware.compression(app);
CommonMiddleware.bodyParser(app);
CommonMiddleware.swagger(app, logger);
app.use(SendPromisedResponse);
app.use(ErrorHandler);

async function initialize(): Promise<void> {
    await Mongo.initialize();
    await AppointmentQueueService.initialize();
}

initialize()
.then(() => {
    const server = Http.createServer(app);
    const port = process.env.port || Config.get('port');
    server.listen(port, () => {
        logger.info('Server started successfully on port:', port);
    });
})
.catch((err) => {
    logger.fatal('Failed to initialize server:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
    logger.fatal(`Got unhandled rejection, reason: ${JSON.stringify(reason)}, promise: ${JSON.stringify(p)}`);
});