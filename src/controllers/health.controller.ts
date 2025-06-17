import { Request, Response } from 'express';

export class HealthController {
  constructor() {}

  async getHealth(req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: 'OK' });
    return;
  }
}