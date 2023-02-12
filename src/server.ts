import express from "express";
import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import { AppError } from "./common/utils/custom-error";
import { TaskController } from "./controllers/task.contoller";
import { initDataSource } from "./database/data-source";

export class Server {
  private readonly app: express.Application;
  private readonly dataSource: DataSource;
  private readonly taskController: TaskController;

  constructor() {
    this.app = express();
    this.dataSource = initDataSource();
    this.taskController = new TaskController();
  }

  public config() {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(express.json());
  }

  public setupRoutes() {
    this.app.use("/api/tasks", this.taskController.getRouter());
    this.app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
      return res.status(err.code ?? 500).json({
        status: false,
        message: err.message,
      });
    });
  }

  public start() {
    this.dataSource
      .initialize()
      .then(() => {
        this.config();

        this.setupRoutes();

        this.app.listen(this.app.get("port"), () => {
          console.log("Server is listening on port ", this.app.get("port"));
        });
      })
      .catch((error) => {
        console.error("Unable to connect to the database. ", error);
        setTimeout(() => {
          this.start();
        }, 1000);
      });
  }
}
