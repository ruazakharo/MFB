import * as Log4js from 'log4js';
import * as Mongo from 'mongodb';
import * as _ from 'lodash';

import * as MongoHelper from '../db/mongo';

interface MongoId {
    _id?: Mongo.ObjectID | string;
}

interface ModelId {
    id?: string;
}

type Document<M> = Partial<M> & MongoId;

export type Projection<M> = {
    [P in keyof M]?: 1 | 0 | true | false;
};

interface FilterPropertyValue<T> {
    $in: T[];
}
export type Filter<M> = {
    [P in keyof M]?: M[P] | FilterPropertyValue<M[P]>
} & _.Dictionary<any>;


type Update<M> = Partial<M> & ModelId & _.Dictionary<any>;


type Operator<T> = {
    [P in keyof T]?: any
} & _.Dictionary<any>;
type UpdateWithOperators<M> = {
    $push?: Operator<M>;
    $pull?: Operator<M>;
    $pullAll?: Operator<M>;
    $addToSet?: Operator<M>;
    $unset?: Operator<M>;
    $set?: Operator<M>;
};

export interface GetOptions<M> {
    filter?: Filter<M>;
    filterById?: string;
    projection?: Projection<M>;
    offset?: number;
    limit?: number;
    sort?: {
        [P in keyof Partial<M>]: number
    };
}

export interface InsertOptions<M> {
    value: Partial<M>;
}

export interface ExistsOptions<M> {
    filter: Filter<M>;
}

export interface UpdateOptions<M> {
    filter?: Filter<M>;
    filterById?: string;
    update?: Update<M>;
    replace?: boolean;
    updateWithOperators?: UpdateWithOperators<M>;
    processModelId?: any;
}

export interface RemoveOptions<M> {
    filter: Filter<M>;
}

export interface PaginatedResult<M> {
    count: number;
    data: M[];
}

export abstract class BaseDAO<M extends ModelId> {
    private collection: Mongo.Collection;
    private dontTransformIds: boolean;

    constructor(private logger: Log4js.Logger, collectionName: string, dontTransformIds?: boolean) {
        MongoHelper.onConnected(db => {
            this.collection = db.collection(collectionName);
        });
        this.dontTransformIds = !!dontTransformIds;
    }

    async insertOne(options: InsertOptions<M>): Promise<M> {
        const result = await this.collection.insertOne(options.value as any);

        if (result.insertedCount != 1) {
            this.logger.warn(`Failed to insert a user document ${result}`);
            return undefined;
        }
        return this.transformDocumentToModel(_.first(result.ops));
    }

    async insertMany(options: InsertOptions<M[]>): Promise<M[]> {
        const result = await this.collection.insertMany(options.value as any);

        if (result.insertedCount != options.value.length) {
            this.logger.warn(`Failed to insert documents ${result}`);
            return undefined;
        }

        return result.ops.map(resDoc => {
            return this.transformDocumentToModel(resDoc);
        });
    }

    async getOne(options: GetOptions<M>): Promise<M> {
        if (_.isString(options.filterById)) {
            options.filter = {
                id: options.filterById
            } as Filter<M>;
        }
        const filterDoc = this.idToMongo(options.filter);

        if (!filterDoc) {
            throw `Invalid filter for get, options: ${JSON.stringify(options)}`;
        }

        const resultDoc = await this.collection.findOne(filterDoc, options.projection as any as Mongo.FindOneOptions);

        if (!resultDoc) {
            return undefined;
        }

        return this.transformDocumentToModel(resultDoc);
    }

    async getMany(options: GetOptions<M>): Promise<M[]> {
        const filterDoc = this.idToMongo(options.filter);

        const result = await this.collection.find(filterDoc, options.projection as any).toArray();

        return _.map(result, d => this.transformDocumentToModel(d));
    }

    async getManyPagination(options: GetOptions<M>): Promise<PaginatedResult<M>> {
        const filterDoc = this.idToMongo(options.filter);

        const offset = options.offset || 0;
        const limit = options.limit;
        const result = await this.collection.find(filterDoc, options.projection as any).skip(offset).limit(limit).sort(options.sort).toArray();
        const count = await this.count(options);

        const data = _.map(result, d => this.transformDocumentToModel(d));
        return {
            data: data,
            count: count
        };
    }

    async exists(options: ExistsOptions<M>): Promise<boolean> {
        const filterDoc = this.idToMongo(options.filter);

        const cursor = await this.collection.find(filterDoc).limit(1);

        const exists = await cursor.hasNext();
        cursor.close();

        return exists;
    }

    async updateOne(options: UpdateOptions<M>): Promise<M> {
        if (_.isString(options.filterById)) {
            options.filter = {
                id: options.filterById
            } as Filter<M>;
        }
        if (!options.filter) {
            throw `Invalid update options ${JSON.stringify(options)}, filter statement is invalid`;
        }
        const filterObject = this.idToMongo(options.filter);

        if (options.processModelId) {
            this.idToMongo(options.processModelId);
        }

        let updateObject;
        if (options.update) {
            if (options.replace) {
                updateObject = this.idToMongo(options.update);
            } else {
                updateObject = {
                    $set: this.idToMongo(options.update)
                };
                if (_.isEmpty(updateObject.$set)) {
                    return;
                }
            }
        } else if (options.updateWithOperators) {
            updateObject = this.idToMongo(options.updateWithOperators);
        } else {
            throw `Invalid update options ${JSON.stringify(options)}`;
        }

        const updateOptions: Mongo.FindOneAndReplaceOption = {
            returnOriginal: false
        };
        const result = await this.collection.findOneAndUpdate(filterObject, updateObject, updateOptions);

        if (result.ok != 1) {
            throw `Failed to update, filter: ${JSON.stringify(filterObject)}, result: ${result}`;
        }

        return this.transformDocumentToModel(result.value);
    }

    async updateMany(options: UpdateOptions<M>): Promise<void> {
        if (!options.filter) {
            throw `Invalid update options ${JSON.stringify(options)}, filter statement is invalid`;
        }
        const filterObject = this.idToMongo(options.filter);

        let updateObject;
        if (options.update) {
            if (options.replace) {
                updateObject = this.idToMongo(options.update);
            } else {
                updateObject = {
                    $set: this.idToMongo(options.update)
                };
                if (_.isEmpty(updateObject.$set)) {
                    return;
                }
            }
        } else if (options.updateWithOperators) {
            updateObject = this.idToMongo(options.updateWithOperators);
        } else {
            throw `Invalid update options ${JSON.stringify(options)}`;
        }

        const result = await this.collection.updateMany(filterObject, updateObject);

        if (result.result.ok != 1) {
            throw `Failed to update, filter: ${JSON.stringify(filterObject)}, result: ${result}`;
        }
    }

    async removeOne(options: RemoveOptions<M>): Promise<void> {
        const filterDoc = this.idToMongo(options.filter);

        const result = await this.collection.findOneAndDelete(filterDoc);

        if (result.ok != 1) {
            throw `Failed to remove, filter: ${filterDoc}, result ${result}`;
        }
    }

    async removeMany(options: RemoveOptions<M>): Promise<void> {
        const filterDoc = this.idToMongo(options.filter);

        const result = await this.collection.deleteMany(filterDoc);

        if (result.result.ok != 1) {
            throw `Failed to remove, filter: ${filterDoc}, result ${result}`;
        }
    }

    count(options: GetOptions<M>): Promise<number> {
        const filterDoc = this.idToMongo(options.filter);

        return this.collection.count(filterDoc);
    }

    private idToMongo<T extends { id?: any } & UpdateWithOperators<any>>(model: T): T & { _id?: any } {
        if (!model) {
            return undefined;
        }

        if (this.dontTransformIds) {
            const doc = _.clone(model) as T & { _id?: any; };
            delete doc._id;
            return model;
        }

        const doc = _.clone(model) as T & { _id?: any; };
        if (_.isString(model.id)) {
            doc._id = new Mongo.ObjectID(model.id);
        } else if (model.id) {
            doc._id = model.id;
            if (doc._id.$in) {
                const isValid = _.every(doc._id.$in, id => _.isString(id) || id instanceof Mongo.ObjectID);
                if (!isValid) {
                    throw 'Invalid $in operator value: ' + JSON.stringify(doc._id.$in);
                }
                doc._id.$in = _.map(doc._id.$in as string[], id => _.isString(id) ? new Mongo.ObjectID(id) : id);
            }
        }
        delete doc.id;

        return doc;
    }

    private transformDocumentToModel(doc: Document<M>): M {
        if (doc._id) {
            if (!this.dontTransformIds) {
                doc.id = doc._id.toString();
            }
            delete doc._id;
        }

        return doc as M;
    }

    generateNewId(): string {
        return new Mongo.ObjectID().toHexString();
    }
}