import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HeadacheRecord } from '../schemas/headache.schema';

@Injectable()
export class HeadacheService {
  constructor(
    @InjectModel(HeadacheRecord.name) private headacheModel: Model<HeadacheRecord>,
  ) {}

  async createRecord(
    userId: string,
    date: Date,
    hadHeadache: boolean,
    headacheStartTime: string | undefined,
    headacheEndTime: string | undefined,
    wentOutsideYesterday: boolean,
    drankWaterYesterday: boolean,
    notes?: string,
  ) {
    const record = await this.headacheModel.create({
      userId: new Types.ObjectId(userId),
      date,
      hadHeadache,
      headacheStartTime,
      headacheEndTime,
      wentOutsideYesterday,
      drankWaterYesterday,
      notes,
    });
    return record;
  }

  async getRecordsByUser(userId: string, limit = 30) {
    console.log('Fetching headache records for userId:', userId);
    
    // First, let's see ALL records in the collection
    const allRecords = await this.headacheModel.find({}).lean().exec();
    console.log('Total records in DB:', allRecords.length);
    if (allRecords.length > 0) {
      console.log('Sample record userId type:', typeof allRecords[0].userId, allRecords[0].userId);
    }
    
    const records = await this.headacheModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .lean()
      .exec();
    console.log('Found headache records:', records.length);
    return records;
  }

  async getRecordByDate(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.headacheModel
      .findOne({
        userId: new Types.ObjectId(userId),
        date: { $gte: startOfDay, $lte: endOfDay },
      })
      .lean()
      .exec();
  }

  async updateRecord(
    recordId: string,
    hadHeadache: boolean,
    headacheStartTime: string | undefined,
    headacheEndTime: string | undefined,
    wentOutsideYesterday: boolean,
    drankWaterYesterday: boolean,
    notes?: string,
  ) {
    return this.headacheModel
      .findByIdAndUpdate(
        recordId,
        { hadHeadache, headacheStartTime, headacheEndTime, wentOutsideYesterday, drankWaterYesterday, notes },
        { new: true },
      )
      .lean()
      .exec();
  }

  async deleteRecord(recordId: string) {
    return this.headacheModel.findByIdAndDelete(recordId).exec();
  }
}
