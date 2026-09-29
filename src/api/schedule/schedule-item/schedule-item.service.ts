import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BulkCreateScheduleItemsDto,
  BulkUpdateScheduleItemsDto,
  CreateScheduleItemDto,
  UpdateScheduleItemDto,
} from './dto/schedule-item.dto';
import { ScheduleItem } from 'src/models/scheduleItem.model';
import { InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class ScheduleItemService {
  constructor(
    @InjectModel(ScheduleItem) private scheduleItemModel: typeof ScheduleItem,
    private readonly sequelize: Sequelize,
  ) {}

  async bulkCreateScheduleItems(
    scheduleId: string,
    bulkCreateScheduleItemDto: BulkCreateScheduleItemsDto,
  ): Promise<ScheduleItem[]> {
    const items = await this.scheduleItemModel.bulkCreate(
      bulkCreateScheduleItemDto.items.map((dto) => ({ scheduleId, ...dto })),
      { updateOnDuplicate: ['id'] },
    );
    return items;
  }

  async bulkUpdateScheduleItems(
    bulkUpdateScheduleItemDto: BulkUpdateScheduleItemsDto,
  ): Promise<ScheduleItem[]> {
    return await this.sequelize.transaction(async (t) => {
      const items = bulkUpdateScheduleItemDto.items;
      const updatedItems: ScheduleItem[] = [];

      for (const dto of items) {
        const updatedItem = await this.updateScheduleItem(dto.id, dto, {
          transaction: t,
        });
        updatedItems.push(updatedItem);
      }

      return updatedItems;
    });
  }

  async createScheduleItem(
    scheduleId: string,
    createScheduleItemDto: CreateScheduleItemDto,
  ): Promise<ScheduleItem> {
    return await this.scheduleItemModel.create<ScheduleItem>({
      scheduleId,
      ...createScheduleItemDto,
    });
  }

  async getScheduleItem(itemId: string): Promise<ScheduleItem> {
    const item = await this.scheduleItemModel.findByPk<ScheduleItem>(itemId);
    if (!item) throw new NotFoundException();

    return item;
  }

  async getScheduleItems(scheduleId: string): Promise<ScheduleItem[]> {
    return this.scheduleItemModel.findAll<ScheduleItem>({
      where: { scheduleId },
    });
  }

  async updateScheduleItem(
    itemId: string,
    updateScheduleItemDto: UpdateScheduleItemDto,
    { transaction }: { transaction?: Transaction } = {},
  ) {
    if (!updateScheduleItemDto.startTime)
      updateScheduleItemDto.startTime = dayjs()
        .hour(updateScheduleItemDto.time?.startTime.hours || 0)
        .minute(updateScheduleItemDto.time?.startTime.minutes || 0)
        .format('HH:mm');
    const [, items] = await this.scheduleItemModel.update<ScheduleItem>(
      updateScheduleItemDto,
      {
        where: { id: itemId },
        returning: true,
        transaction,
      },
    );
    if (!items.length) throw new NotFoundException();

    return items[0];
  }

  async deleteScheduleItem(itemId: string) {
    await this.scheduleItemModel.destroy({ where: { id: itemId } });
  }
}
