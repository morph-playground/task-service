import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskRequest } from '../models/task.model';
import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class TaskService {
  private tasks: Task[] = [];

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async createTask(userId: string, createTaskRequest: CreateTaskRequest): Promise<Task> {
    console.log(`Creating task for user: ${userId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, Domain.TASK, Action.CREATE);
    if (!hasPermission) {
      console.error('Insufficient permissions to create task');
      throw new Error('Insufficient permissions to create task');
    }

    const task: Task = {
      id: uuidv4(),
      userId,
      ...createTaskRequest
    };

    this.tasks.push(task);
    console.log(`Task created: ${task.id}`);
    return task;
  }

  async getTasks(userId: string): Promise<Task[]> {
    console.log(`Fetching tasks for user: ${userId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, Domain.TASK, Action.LIST);
    if (!hasPermission) {
      console.error('Insufficient permissions to list tasks');
      throw new Error('Insufficient permissions to list tasks');
    }

    const userTasks = this.tasks.filter(task => task.userId === userId);
    console.log(`Found ${userTasks.length} tasks for user`);
    return userTasks;
  }
}