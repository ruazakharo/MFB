import * as Config from 'config';
import * as Log4js from 'log4js';
import * as Mongo from 'mongodb';
import * as _ from 'lodash';

const logger = Log4js.getLogger('db.mongo');

export let db: Mongo.Db;

export interface OnConnectedCallback {
    (db: Mongo.Db): void;
}

const onConnectedCallbacks: OnConnectedCallback[] = [];

export function onConnected(cb: OnConnectedCallback): void {
     if (db) {
         cb(db);
     } else {
         onConnectedCallbacks.push(cb);
     }
}

export async function initialize(): Promise<void> {
    if (db) {
        logger.warn('Mongo client already initialized');
        return Promise.resolve();
    }

    const url = Config.get<string>('mongo.connectionString');
    const options = Config.get('mongo.options') || {};

    logger.info('Connecting to mongo:', url);
    logger.info('Options:', options);

    const client = await Mongo.MongoClient.connect(url);
    db = client.db('');

    logger.info('Successfully connected to MongoDB');

    _.forEach(onConnectedCallbacks, (cb) => cb(db));
}