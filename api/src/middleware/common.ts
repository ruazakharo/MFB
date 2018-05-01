import * as Express from 'express';
import * as BodyParser from 'body-parser';
import * as Http from 'http';
import * as Swaggerize from 'swaggerize-express';
import * as Path from 'path';
import * as Log4js from 'log4js';
import * as Config from 'config';
import * as Yaml from 'js-yaml';
const Compression = require('compression');
const SwaggerUI = require('swaggerize-ui');

import * as API from '../models/api';

export function logger(app: Express.Application) {
    app.use(Log4js.connectLogger(Log4js.getLogger('server.http'), {}));
}

export function bodyParser(app: Express.Application) {
    app.use(BodyParser.json());
}

export function swagger(app: Express.Application, logger: Log4js.Logger) {
    const spec = Yaml.safeLoad(Path.resolve(Config.get<string>('specFilePath')));
    app.use(Swaggerize({
        api: spec as any,
        handlers: Path.resolve('./api'),
        docspath: '/api-docs/spec'
    }));

    logger.info('Setting up Swagger UI');
    app.use('/botf/api/api-docs', SwaggerUI({
        docs: 'spec'
    }));
}

export function compression(app: Express.Application) {
    app.use(Compression());
}

export function cors(app: Express.Application) {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Type, billing-supported');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE, OPTIONS');
        if (req.method != 'OPTIONS') {
            next();
        } else {
            res.end();
        }
    });
}