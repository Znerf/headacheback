import { IsBoolean, IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class CreateHeadacheDto {
  @IsDateString()
  date: string;

  @IsBoolean()
  hadHeadache: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start time must be in 24-hour format (HH:mm)' })
  headacheStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End time must be in 24-hour format (HH:mm)' })
  headacheEndTime?: string;

  @IsBoolean()
  wentOutsideYesterday: boolean;

  @IsBoolean()
  drankWaterYesterday: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateHeadacheDto {
  @IsBoolean()
  hadHeadache: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start time must be in 24-hour format (HH:mm)' })
  headacheStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End time must be in 24-hour format (HH:mm)' })
  headacheEndTime?: string;

  @IsBoolean()
  wentOutsideYesterday: boolean;

  @IsBoolean()
  drankWaterYesterday: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
