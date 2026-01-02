import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HeadacheService } from './headache.service';
import { CreateHeadacheDto, UpdateHeadacheDto } from './dto/headache.dto';

@Controller('headache')
@UseGuards(JwtAuthGuard)
export class HeadacheController {
  constructor(private readonly headacheService: HeadacheService) {}

  @Post()
  async createRecord(@Request() req, @Body() dto: CreateHeadacheDto) {
    const userId = req.user._id.toString();
    return this.headacheService.createRecord(
      userId,
      new Date(dto.date),
      dto.hadHeadache,
      dto.headacheStartTime,
      dto.headacheEndTime,
      dto.wentOutsideYesterday,
      dto.drankWaterYesterday,
      dto.notes,
    );
  }

  @Get()
  async getRecords(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const userId = req.user._id.toString();
    const recordLimit = limit ? parseInt(limit, 10) : 10;
    const recordPage = page ? parseInt(page, 10) : 1;
    return this.headacheService.getRecordsByUser(userId, recordLimit, recordPage);
  }

  @Get('by-date')
  async getRecordByDate(@Request() req, @Query('date') date: string) {
    const userId = req.user._id.toString();
    return this.headacheService.getRecordByDate(userId, new Date(date));
  }

  @Put(':id')
  async updateRecord(@Param('id') id: string, @Body() dto: UpdateHeadacheDto) {
    return this.headacheService.updateRecord(
      id,
      dto.hadHeadache,
      dto.headacheStartTime,
      dto.headacheEndTime,
      dto.wentOutsideYesterday,
      dto.drankWaterYesterday,
      dto.notes,
    );
  }

  @Delete(':id')
  async deleteRecord(@Param('id') id: string) {
    return this.headacheService.deleteRecord(id);
  }
}
