import express from 'express';
import { HealthController } from './controllers/health.controller';
import { TaskController } from './controllers/task.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { TaskService } from './services/task.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  console.log('Initializing IdentityProvider');
  const identityProvider = new IdentityProvider();

  console.log('Initializing PermissionServiceClient');
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);

  console.log('Initializing TaskService');
  const taskService = new TaskService(permissionServiceClient);

  const healthController = new HealthController();
  const taskController = new TaskController(taskService, identityProvider);

  console.log('Registering routes');
  app.get('/health', (req, res) => healthController.getHealth(req, res));
  app.post('/tasks', (req, res) => taskController.createTask(req, res));
  app.get('/tasks', (req, res) => taskController.getTasks(req, res));

  return app;
}