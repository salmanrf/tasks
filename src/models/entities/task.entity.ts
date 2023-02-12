import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  task_id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column({ type: "bool", nullable: false, default: false })
  finished: boolean;

  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date | string;
}
