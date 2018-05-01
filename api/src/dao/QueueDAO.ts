import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import Queue from '../models/Queue';

const logger = Log4js.getLogger('dao.queue');

class QueueDAO extends BaseDAO<Queue> {
    constructor() {
        super(logger, 'queues');
    }
}

const instance = new QueueDAO();
export default instance;