import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }


    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @GetUser() USER: User,
    ): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, USER);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() USER: User,
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, USER);
    }


    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) ID: number,
        @GetUser() USER: User,
    ): Promise<Task> {
        console.log("Search is " + ID);
        return this.tasksService.getTaskByID(ID, USER);
    }


    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) ID: number,
        @Body('status', TaskStatusValidationPipe) STATUS: TaskStatus,
        @GetUser() USER: User,
    ): Promise<Task> {
        console.log(ID + " to Update Status")
        return this.tasksService.updateTaskStatus(ID, STATUS, USER);
    }


    @Delete('/:id')
    deleteTaskByID(
        @Param('id', ParseIntPipe) ID: number,
        @GetUser() USER: User,
    ): Promise<void> {
        console.log(ID + " to Delete Process (Controller)");
        return this.tasksService.deleteTaskByID(ID,USER);
    }
}