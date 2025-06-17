import { Request, Response } from 'express';

import { Request, Response } from 'express';

export class HealthController {
  getHealth(req: Request, res: Response): void {
    console.log('Received request to get health status');
    res.status(200).json({ status: "OK" });
    console.log('Responded with health status');
  }
}