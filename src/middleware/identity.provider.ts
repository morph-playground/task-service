import { Request } from 'express';

export class IdentityProvider {
  getUserId(req: Request): string | null {
    const userId = req.header('identity-user-id');
    return userId || null;
  }
}