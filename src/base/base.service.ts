import { set } from "lodash";
import { DeleteResponse, Pagination, PaginationResponse } from "src/utils/response";
import { AnyKeys, FilterQuery, Model, MongooseBulkWriteOptions, AnyBulkWriteOperation, QueryOptions, UpdateQuery, Document, Types, ProjectionType } from "mongoose";

export class BaseService<T extends Document> {
  constructor(public readonly model: Model<T>) { }

  create(data: AnyKeys<T>) {
    return this.model.create(data);
  }

  findOneAndUpdate(filter: FilterQuery<T>, data: UpdateQuery<T>, options?: QueryOptions<T>) {
    return this.model.findOneAndUpdate(filter, data, options);
  }

  updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>) {
    return this.model.updateOne(filter, data);
  }

  findByIdAndUpdate(id: any, data: UpdateQuery<T>, options?: QueryOptions<T>) {
    return this.model.findByIdAndUpdate(id, data, options);
  }

  updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>) {
    return this.model.updateMany(filter, data);
  }

  findOne(_filter?: FilterQuery<T>) {
    return this.model.findOne(_filter);
  }

  findAll(filter: FilterQuery<T> = {}, options?: QueryOptions<T>) {
    return this.model.find(filter, {}, options);
  }

  findById(id: Types.ObjectId | string, options?: QueryOptions<T>) {
    return this.model.findById(id, options);
  }

  count(filter: FilterQuery<T> = {}) {
    return this.model.countDocuments(filter);
  }

  bulkWrite(writes: AnyBulkWriteOperation<any>[], options?: MongooseBulkWriteOptions) {
    return this.model.bulkWrite(writes, options);
  }

  async getAll(pagination: Pagination, filter: FilterQuery<T> = {}, _options?: QueryOptions<T>): Promise<PaginationResponse<T>> {
    if (pagination.keyword) {
      set(filter, '$text.$search', pagination.keyword)
    }
    const data = this.model.find({ ...filter, isDeleted: false }).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit);
    if (pagination.sort) data.sort(pagination.sort);
    const total = await this.count({ ...filter, isDeleted: false });

    return {
      data: await data,
      total,
      ...pagination
    }
  }

  async deleteMany(ids: Array<string>): Promise<DeleteResponse> {
    const count = await this.count({ _id: { $in: ids } });
    await this.updateMany(
      { _id: { $in: ids } },
      {
        isDeleted: true
      })

    return {
      deleted: count
    }
  }
}
