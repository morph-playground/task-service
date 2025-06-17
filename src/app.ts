import express from 'express';
import { HealthController } from './controllers/health.controller';
import { TaskController } from './controllers/task.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { TaskService } from './services/task.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  const identityProvider = new IdentityProvider();
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);
  const taskService = new TaskService(permissionServiceClient);

  const healthController = new HealthController();
  const taskController = new TaskController(taskService, identityProvider);

  app.get('/health', (req, res) => {
    console.log('GET /health called');
    healthController.getHealth(req, res);
  });
  app.post('/tasks', (req, res) => {
    console.log('POST /tasks called with body:', req.body);
    taskController.createTask(req, res);
  });
  app.get('/tasks', (req, res) => {
    console.log('GET /tasks called');
    taskController.getTasks(req, res);
  });

  return app;
}