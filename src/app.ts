import express from 'express';
import { HealthController } from './controllers/health.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  const identityProvider = new IdentityProvider();
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);

  const healthController = new HealthController();

  app.get('/health', (req, res) => healthController.getHealth(req, res));

  return app;
}