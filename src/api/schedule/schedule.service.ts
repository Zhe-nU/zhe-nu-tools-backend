import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Schedule } from 'src/models/schedule.model';
import { ScheduleItem } from 'src/models/scheduleItem.model';
import {
  CreateScheduleDto,
  ScheduleWithItemsDto,
  UpdateScheduleDto,
} from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule) private scheduleModel: typeof Schedule,
    @InjectModel(ScheduleItem) private scheduleItemModel: typeof ScheduleItem,
    private readonly sequelize: Sequelize,
  ) {}

  async createSchedule(
    userId: string,
    createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleWithItemsDto> {
    return await this.scheduleModel.create<Schedule>(
      {
        userId,
        ...createScheduleDto,
        items: [],
      },
      { include: [ScheduleItem] },
    );
  }

  async deleteSchedule(scheduleId: string) {
    await this.sequelize.transaction(async (t) => {
      await this.scheduleItemModel.destroy({
        where: { scheduleId },
        transaction: t,
      });

      await this.scheduleModel.destroy({
        where: { id: scheduleId },
        transaction: t,
      });
    });
  }

  async getSchedule(scheduleId: string): Promise<Schedule> {
    const schedule = await this.scheduleModel.findByPk(scheduleId, {
      include: ScheduleItem,
    });
    if (!schedule) throw new NotFoundException();

    return schedule;
  }

  async updateSchedule(
    scheduleId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleWithItemsDto> {
    const schedule = await this.scheduleModel.findByPk(scheduleId, {
      include: [ScheduleItem],
    });
    if (!schedule) throw new NotFoundException();

    return await schedule.update(updateScheduleDto, {
      returning: true,
    });
  }

  async userScheduleList(userId: string): Promise<Schedule[]> {
    return await this.scheduleModel.findAll({
      where: { userId },
      include: ScheduleItem,
    });
  }
}
