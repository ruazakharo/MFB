import * as Express from 'express';
import * as HttpStatus from 'http-status-codes';

declare module 'express' {
    interface Response {
        promise: Promise<any>;
    }
}

export function sendResponseFromPromise(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    if (res.promise) {
        res.promise
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(HttpStatus.NO_CONTENT).end();
            }
        })
        .catch(next);
    } else {
        next();
    }
}