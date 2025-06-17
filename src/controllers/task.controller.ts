import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { IdentityProvider } from '../middleware/identity.provider';

export class TaskController {
  constructor(
    private taskService: TaskService,
    private identityProvider: IdentityProvider
  ) {}

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      console.log('createTask called with body:', req.body);
      const userId = this.identityProvider.getUserId(req);
      const tenantId = this.identityProvider.getTenantId(req);
      if (!userId) {
        console.warn('User ID not provided for createTask');
        res.status(401).json({ error: 'User ID not provided' });
        return;
      }
      if (!tenantId) {
        console.warn('Tenant ID not provided for createTask');
        res.status(401).json({ error: 'Tenant ID not provided' });
        return;
      }

      const task = await this.taskService.createTask(userId, tenantId, req.body);
      console.log('Task created:', task);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error occurred in createTask:', error);
      if (error instanceof Error && error.message.includes('Insufficient permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      console.log('getTasks called');
      const userId = this.identityProvider.getUserId(req);
      const tenantId = this.identityProvider.getTenantId(req);
      if (!userId) {
        console.warn('User ID not provided for getTasks');
        res.status(401).json({ error: 'User ID not provided' });
        return;
      }
      if (!tenantId) {
        console.warn('Tenant ID not provided for getTasks');
        res.status(401).json({ error: 'Tenant ID not provided' });
        return;
      }

      const tasks = await this.taskService.getTasks(userId, tenantId);
      console.log(`Tasks retrieved for user ${userId} tenant ${tenantId}:`, tasks);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error occurred in getTasks:', error);
      if (error instanceof Error && error.message.includes('Insufficient permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}