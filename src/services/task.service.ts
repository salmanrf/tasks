import { AppDataSource } from "../database/data-source";
import { Task } from "../models/entities/task.entity";
import { DataSource, ILike, Repository } from "typeorm";
import { AppError } from "../common/utils/custom-error";
import { GetPaginatedData, GetPagination } from "../common/utils/pagination.util";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { FindTasksDto } from "../dtos/find-task.dto";
import { UpdateTaskDto } from "../dtos/update-task.dto";

export class TaskService {
  private readonly dataSource: DataSource;
  private readonly taskRepo: Repository<Task>;

  constructor() {
    this.dataSource = AppDataSource;
    this.taskRepo = AppDataSource.getRepository(Task);
  }

  async create(createDto: CreateTaskDto): Promise<Task> {
    try {
      const { title, description, finished } = createDto;

      const task = await this.taskRepo.save({
        title,
        description,
        finished,
      });

      return task;
    } catch (error) {
      throw error;
    }
  }

  async updateTask(task_id: string, updateDto: UpdateTaskDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const { title, description, finished } = updateDto;

      let task = await this.taskRepo.findOne({
        where: { task_id },
      });

      if (!task) {
        throw new AppError("Task not found.", 404);
      }

      if (title != null) {
        task.title = title;
      }

      if (description != null) {
        task.description = description;
      }

      if (finished != null) {
        task.finished = finished;
      }

      task = await queryRunner.manager.save(Task, task);

      await queryRunner.commitTransaction();

      return task;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(task_id: string) {
    try {
      const taskQb = this.taskRepo.createQueryBuilder("t");

      taskQb.where({ task_id });

      const task = await taskQb.getOne();

      if (!task) {
        throw new AppError("Task not found.", 400);
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  async findMany(findDto: FindTasksDto) {
    try {
      const { title, description, finished, page, limit: pageSize } = findDto;
      let { sort_field, sort_order } = findDto;

      const { limit, offset } = GetPagination(+page, +pageSize);

      const taskQb = this.taskRepo.createQueryBuilder("t");

      const fields = ["task_id", "title", "description", "finished", "created_at"];
      const orders = ["ASC", "DESC"];

      if (title) {
        taskQb.andWhere(
          {
            title: ILike("%:title%"),
          },
          { title }
        );
      }

      if (description) {
        taskQb.andWhere(
          {
            description: ILike("%:description%"),
          },
          { description }
        );
      }

      if (finished != null) {
        taskQb.andWhere({
          finished: (finished as unknown as string) == "true",
        });
      }

      if (!fields.includes(sort_field)) {
        sort_field = "created_at";
      }

      if (!orders.includes(sort_order)) {
        sort_order = "DESC";
      }

      taskQb.take(limit);
      taskQb.skip(offset);

      taskQb.addOrderBy("t." + sort_field, sort_order);

      const results = await taskQb.getManyAndCount();

      const data = GetPaginatedData({
        limit,
        sort_field,
        sort_order,
        count: results[1],
        items: results[0],
        page: isNaN(+page) ? 1 : +page || 1,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async delete(task_id: string) {
    try {
      const taskQb = this.taskRepo.createQueryBuilder("t");

      taskQb.where({ task_id });

      const task = await taskQb.getOne();

      if (!task) {
        throw new AppError("Task not found.", 400);
      }

      await this.taskRepo.delete({ task_id: task.task_id });

      return task;
    } catch (error) {
      throw error;
    }
  }
}
