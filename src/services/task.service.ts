import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskRequest } from '../models/task.model';
import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class TaskService {
  private tasks: Task[] = [];

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async createTask(userId: string, tenantId: string, createTaskRequest: CreateTaskRequest): Promise<Task> {
    console.log(`[TaskService] Checking CREATE permission for user: ${userId}, tenant: ${tenantId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, tenantId, Domain.TASK, Action.CREATE); // Pass tenantId
    if (!hasPermission) {
      console.warn(`[TaskService] User ${userId} in tenant ${tenantId} lacks permission to create task`);
      throw new Error('Insufficient permissions to create task');
    }

    const task: Task = {
      id: uuidv4(),
      userId,
      // Add tenantId here if it were part of the model, but it's not according to requirements
      ...createTaskRequest
    };

    this.tasks.push(task);
    console.log(`[TaskService] Created task with id: ${task.id} for user: ${userId} in tenant: ${tenantId}`);
    return task;
  }

  async getTasks(userId: string, tenantId: string): Promise<Task[]> {
    console.log(`[TaskService] Checking LIST permission for user: ${userId}, tenant: ${tenantId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, tenantId, Domain.TASK, Action.LIST); // Pass tenantId
    if (!hasPermission) {
      console.warn(`[TaskService] User ${userId} in tenant ${tenantId} lacks permission to list tasks`);
      throw new Error('Insufficient permissions to list tasks');
    }

    // Filter tasks by userId. Assuming tasks are implicitly scoped by tenant via the permission check.
    // If tasks also needed to store tenantId for filtering, the data model would need to change.
    const userTasks = this.tasks.filter(task => task.userId === userId);
    console.log(`[TaskService] Found ${userTasks.length} tasks for user: ${userId} in tenant: ${tenantId}`);
    return userTasks;
  }
}