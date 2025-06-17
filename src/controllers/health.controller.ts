import { Request, Response } from 'express';

export class HealthController {
  getHealth(req: Request, res: Response): void {
    console.debug(`[HealthController] getHealth called at ${new Date().toISOString()}`);
    res.status(200).json({ status: "OK" });
  }
}