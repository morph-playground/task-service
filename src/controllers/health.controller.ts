import { Request, Response } from 'express';

export class HealthController {
  getHealth(req: Request, res: Response): void {
    res.status(200).json({ status: "OK" });
  }
}