import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum"
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async getTask(
        filterDto: GetTaskFilterDto,
        USER: User,
    ): Promise<Task[]> {
        const STATUS = filterDto.status;
        const SEARCH = filterDto.search;
        const query = this.createQueryBuilder('task');

        query.andWhere('task.userId = :userId',{userId: USER.id})

        if (STATUS) {
            query.andWhere('task.status = :STATUS', { STATUS });
        }
        if (SEARCH) {
            query.andWhere('(task.title LIKE :sch OR task.description LIKE :sch)', { sch: `%${SEARCH}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }


    async createTask(
        createTaskDto: CreateTaskDto,
        USER: User,    
    ): Promise<Task> {
        const TITLE = createTaskDto.title;
        const DESCRIPTION = createTaskDto.description;

        const TASK = new Task();
        TASK.title = TITLE;
        TASK.description = DESCRIPTION;
        TASK.status = TaskStatus.OPEN;
        TASK.user = USER;
        await TASK.save();

        delete TASK.user
        return TASK;
    }
}
