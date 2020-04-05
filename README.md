# Welcome to NestJS#3 Database Relationship
<p align="center">
<img src="https://cdn.britannica.com/93/153593-050-15D2B42F/Osama-bin-Laden.jpg" width="320" />
  <h4><a href="https://github.com/smileu2za001/nestjs">PART1 - SQL DB Connecting</a></h4>
  <h4><a href="https://github.com/smileu2za001/nestjs-auth">PART2 - User Authentication</a></h4>
  <h4><a href="https://github.com/smileu2za001/smileu2za001-nestjs-relation">PART3 - Database Relationship</a></h4>
</p>

## Relation
- user..entity
```bash
import { Task } from '../tasks/task.entity';
   
export class User extends BaseEntity {
@OneToMany(type => Task, TASK => TASK.user, { eager: true });
  tasks: Task[];
```
- task.entity
```bash
import { Task } from '../auth/user.entity'

export class Task extends BaseEntity{      
  @ManyToOne(type => User, USER => USER.tasks, { eager: false })
  user: User;
  @Column()
  userId: number;
```

## Create Task for User
- New file on ‘auth’ get-user.decorator.ts
```bash
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
```
#### Controller 
```bash
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() USER: User,
  ): Promise<Task> {
      return this.tasksService.createTask(createTaskDto, USER);
  }
```
#### Service
```bash
  async createTask(
      createTaskDto: CreateTaskDto,
      USER: User,
  ): Promise<Task> {
      return
```
#### Repository
```bash
  async createTask(
      createTaskDto: CreateTaskDto,
      USER: User,    
  ): Promise<Task> {
      //…….
      TASK.user = USER;
      await TASK.save();

      delete TASK.user
  return TASK;
  }
```

## Getting Task for User
- Is same Header Create Task for User add 'USER:user' into getTasks()
- Repository
```bash
  query.andWhere('task.userId = :userId',{userId: USER.id})
```

## Getting User's Tasks
- Is same Header Create Task for User add 'USER:user' into getTaskById()
- Service
```bash
        const found = await this.taskRepository.findOne({ where: { id: ID, userId: USER.id } });
```

## Update User's Tasks Status
- Is same Header Create Task for User add 'USER:user' into updateTaskStatus()


## Detete User's Tasks Status
- Is same Header Create Task for User add 'USER:user' into deleteTaskByID()