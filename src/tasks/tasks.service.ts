import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { userInfo } from 'os';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}


  async getTasks(filterDto: GetTaskFilterDto, USER: User): Promise<Task[]> {
    return this.taskRepository.getTask(filterDto, USER);
  }


  async getTaskByID(ID: number, USER: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where:{ id: ID, userId: USER.id }});
    if (!found) {
      throw new NotFoundException('Task with ID ' + ID + ' not found');
    }
    return found;
  }


  async createTask(createTaskDto: CreateTaskDto, USER: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, USER);
  }


  async deleteTaskByID(ID: number, USER: User): Promise<void> {
    const result = await this.taskRepository.delete({ id: ID, userId: USER.id });
    if (result.affected === 0) {
      throw new NotFoundException('Can\'t Delete, Task with ID ' + ID + ' not found');
    }
  }


  async updateTaskStatus(ID: number, STATUS: TaskStatus, USER: User, ): Promise<Task> {
    const task = await this.getTaskByID(ID, USER);
    task.status = STATUS;
    await task.save();
    return task;
  }
}
