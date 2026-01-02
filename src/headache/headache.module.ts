import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeadacheController } from './headache.controller';
import { HeadacheService } from './headache.service';
import { HeadacheRecord, HeadacheRecordSchema } from '../schemas/headache.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HeadacheRecord.name, schema: HeadacheRecordSchema },
    ]),
  ],
  controllers: [HeadacheController],
  providers: [HeadacheService],
  exports: [HeadacheService],
})
export class HeadacheModule {}
