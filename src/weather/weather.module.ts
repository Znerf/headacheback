import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { WeatherRecord, WeatherRecordSchema } from '../schemas/weather.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WeatherRecord.name, schema: WeatherRecordSchema },
    ]),
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
