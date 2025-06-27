import { Request } from 'express';

export class IdentityProvider {
  getUserId(req: Request): string | null {
    const userId = req.header('identity-user-id');
    console.log(`[IdentityProvider] Extracted userId:`, userId);
    return userId || null;
  }

  getTenantId(req: Request): string | null {
    const tenantId = req.header('identity-tenant-id'); // Get tenantId from header
    console.log(`[IdentityProvider] Extracted tenantId:`, tenantId);
    return tenantId || null;
  }
}