import express from 'express';
import { HealthController } from './controllers/health.controller';

export function createApp() {
  const app = express();
  app.use(express.json());

  const healthController = new HealthController();

  app.get('/health', (req, res) => healthController.getHealth(req, res));

  return app;
}