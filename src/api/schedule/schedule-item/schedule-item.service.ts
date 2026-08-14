import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateScheduleItemDto,
  UpdateScheduleItemDto,
} from './dto/schedule-item.dto';
import { ScheduleItem } from 'src/models/scheduleItem.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ScheduleItemService {
  constructor(
    @InjectModel(ScheduleItem) private scheduleItemModel: typeof ScheduleItem,
  ) {}

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
  ) {
    const [, items] = await this.scheduleItemModel.update<ScheduleItem>(
      updateScheduleItemDto,
      {
        where: { id: itemId },
        returning: true,
      },
    );
    if (!items.length) throw new NotFoundException();

    return items[0];
  }

  async deleteScheduleItem(itemId: string) {
    await this.scheduleItemModel.destroy({ where: { id: itemId } });
  }
}
