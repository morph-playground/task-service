import { Request, Response } from 'express';

import { Request, Response } from 'express';

export class HealthController {
  getHealth(req: Request, res: Response): void {
    console.log('Entering getHealth endpoint');
    res.status(200).json({ status: "OK" });
    console.log('Exiting getHealth endpoint');
  }
}