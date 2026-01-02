import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { User } from '../schemas/user.schema';
import { WeatherRecord } from '../schemas/weather.schema';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(WeatherRecord.name) private weatherModel: Model<WeatherRecord>,
  ) {}

  // Runs every day at 5:45 PM Pacific Time
  @Cron('45 17 * * *', {
    timeZone: 'America/Los_Angeles',
  })
  async fetchDailyWeather(): Promise<void> {
    this.logger.log('Starting nightly weather fetch job');

    const users = await this.userModel.find({
      location: { $ne: null },
      'location.latitude': { $exists: true },
      'location.longitude': { $exists: true },
    });

    if (!users.length) {
      this.logger.log('No users with location coordinates to fetch weather for.');
      return;
    }

    this.logger.log(`Fetching weather for ${users.length} user(s).`);

    for (const user of users) {
      try {
        const loc = user.location;
        if (!loc?.latitude || !loc?.longitude) {
          this.logger.warn(`Skipping user ${user.email}: missing coordinates`);
          continue;
        }

        this.logger.log(
          `Fetching weather for user ${user.email} at (${loc.latitude}, ${loc.longitude})`,
        );

        const weather = await this.fetchWeatherForLocation(loc.latitude, loc.longitude);

        await this.weatherModel.create({
          userId: user._id,
          location: loc,
          weather,
          provider: 'open-meteo',
        });

        this.logger.log(`Stored weather for user ${user.email}`);
      } catch (error) {
        this.logger.error(`Failed to fetch weather for user ${user.email}: ${error.message}`);
      }
    }

    this.logger.log('Nightly weather fetch job completed');
  }

  private async fetchWeatherForLocation(latitude: number, longitude: number) {
    const hourlyParams = [
      'temperature_2m',
      'apparent_temperature',
      'dew_point_2m',
      'relative_humidity_2m',
      'precipitation',
      'wind_speed_10m',
      'cloud_cover',
      'pressure_msl',
      'visibility',
      'uv_index',
    ].join(',');

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&hourly=${hourlyParams}` +
      `&timezone=auto`;

    this.logger.debug(`Weather API request: ${url}`);
    const response = await axios.get(url, { timeout: 10000 });
    this.logger.debug('Weather API response received');
    return response.data;
  }

  async getLatestForUser(userId: string) {
    const latest = await this.weatherModel
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latest) {
      return { message: 'No weather data yet. It will appear after the nightly run.' };
    }

    return {
      recordedAt: latest.createdAt,
      location: latest.location,
      weather: latest.weather,
      provider: latest.provider,
    };
  }
}
