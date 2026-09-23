import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { AvitoItemsService } from './avitoItems.service';
import { ApiParam } from '@nestjs/swagger';
import { OwnershipGuard } from '../../guards/ownership.guard';
import { ZodResponse } from 'nestjs-zod';

@ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
@UseGuards(OwnershipGuard)
@Controller()
export class AvitoItemsController {
  constructor(private readonly avitoItemsService: AvitoItemsService) {}

  @Get()
  @ZodResponse({ status: HttpStatus.OK, type: SchedulesWithItemsDto })
  async getSelfAvitoItems(
    @Param('userId') userId: string,
    @Query('per_page') perPage?: string,
    @Query('page') page?: number,
    @Query('status') status?: string,
  ) {
    return this.avitoItemsService.getUserItems(userId, {})
  }
}
