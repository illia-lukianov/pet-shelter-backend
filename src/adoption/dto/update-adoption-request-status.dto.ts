import { AdoptionStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateAdoptionRequestStatusDto {
  @IsEnum(AdoptionStatus)
  status: AdoptionStatus;
}
