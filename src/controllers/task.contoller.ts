import { NextFunction, Request, Response, Router } from "express";
import { CreateTaskSchema } from "../dtos/create-task.dto";
import { UpdateTaskSchema } from "../dtos/update-task.dto";
import { Validate } from "../dtos/validate";
import { TaskService } from "../services/task.service";

export class TaskController {
  private router: Router;
  private taskService: TaskService;

  constructor() {
    this.router = Router();
    this.taskService = new TaskService();

    this.setupRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/", Validate(CreateTaskSchema), this.create);
    this.router.get("/:task_id", this.findOneTask);
    this.router.get("/", this.findTasks);
    this.router.put("/:task_id", Validate(UpdateTaskSchema), this.update);
    this.router.delete("/:task_id", this.delete);
  }

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const result = await this.taskService.create(body);

      return res.status(201).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task_id } = req.params;
      const { body } = req;

      const result = await this.taskService.updateTask(task_id, body);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task_id } = req.params;

      const result = await this.taskService.delete(task_id);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private findOneTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task_id } = req.params;

      const result = await this.taskService.findOne(task_id);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private findTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req;

      const result = await this.taskService.findMany(query as any);

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
