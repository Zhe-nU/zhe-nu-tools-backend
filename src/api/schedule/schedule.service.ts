import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Schedule } from 'src/models/schedule.model';
import { ScheduleItem } from 'src/models/scheduleItem.model';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { CreateScheduleDto } from './dto/createSchedule.dto';

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
  ): Promise<Schedule> {
    return await this.sequelize.transaction(async (t) => {
      const schedule = await this.scheduleModel.create<Schedule>(
        {
          userId,
          name: createScheduleDto.name,
        },
        { transaction: t },
      );

      if (createScheduleDto.items?.length)
        await this.scheduleItemModel.bulkCreate(
          createScheduleDto.items?.map((i) => ({
            ...i,
            scheduleId: schedule.id,
          })),
          { transaction: t },
        );

      return schedule.reload({ transaction: t });
    });
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
    const schedule = await this.scheduleModel.findByPk(scheduleId);
    if (!schedule) throw new NotFoundException();

    return schedule;
  }

  async updateSchedule(
    scheduleId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const updatedSchedule = await this.sequelize.transaction(async (t) => {
      if (updateScheduleDto.items) {
        await this.scheduleItemModel.destroy({
          where: { scheduleId },
          transaction: t,
        });

        await this.scheduleItemModel.bulkCreate(
          updateScheduleDto.items?.map((s) => ({
            scheduleId,
            ...s,
          })) || [],
          {
            updateOnDuplicate: [
              'scheduleId',
              'weekDay',
              'startTime',
              'endTime',
            ],
            transaction: t,
          },
        );
      } else
        updatedSchedule['items'] = await this.scheduleItemModel.findAll({
          where: { scheduleId },
        });

      return (
        await this.scheduleModel.update(updateScheduleDto, {
          where: { id: scheduleId },
          returning: true,
          transaction: t,
        })
      )[1][0];
    });

    return updatedSchedule;
  }

  async userScheduleList(userId: string): Promise<Schedule[]> {
    return await this.scheduleModel.findAll({ where: { userId } });
  }
}
