import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(JwtAuthGuard)
  @Get('latest')
  async latest(@Request() req) {
    return this.weatherService.getLatestForUser(req.user._id.toString());
  }
}
