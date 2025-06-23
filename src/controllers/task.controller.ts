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
      
      const userId = this.identityProvider.getUserId(req);
      if (!userId) {
        
        res.status(401).json({ error: 'User ID not provided' });
        return;
      }

      const task = await this.taskService.createTask(userId, req.body);
      
      res.status(201).json(task);
    } catch (error) {
      
      if (error instanceof Error && error.message.includes('Insufficient permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      
      const userId = this.identityProvider.getUserId(req);
      if (!userId) {
        
        res.status(401).json({ error: 'User ID not provided' });
        return;
      }

      const tasks = await this.taskService.getTasks(userId);
      
      res.status(200).json(tasks);
    } catch (error) {
      
      if (error instanceof Error && error.message.includes('Insufficient permissions')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}