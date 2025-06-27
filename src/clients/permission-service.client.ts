import axios from 'axios';

export enum Domain {
  PROJECT = 'PROJECT',
  PROJECT_USER = 'PROJECT_USER',
  TASK = 'TASK',
  SUBSCRIPTION = 'SUBSCRIPTION',
  USER = 'USER'
}

export enum Action {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LIST = 'LIST',
  ACCESS_ALL = 'ACCESS_ALL'
}

export interface PermissionServiceConfig {
  host: string;
  port: number;
}

export interface PermissionResponse {
  allowed: boolean;
}

export class PermissionServiceClient {
  private baseUrl: string;

  constructor(config: PermissionServiceConfig) {
    this.baseUrl = `http://${config.host}:${config.port}`;
    console.log(`[PermissionServiceClient] Initialized with baseUrl: ${this.baseUrl}`);
  }

  async hasPermission(subjectId: string, domain: Domain, action: Action, tenantId?: string): Promise<boolean> {
    console.log(`[PermissionServiceClient] Checking permission for subjectId=${subjectId}, domain=${domain}, action=${action}, tenantId=${tenantId}`);
    try {
      const response = await axios.get<PermissionResponse>(
        `${this.baseUrl}/v2/permissions/check`,
        {
          params: {
            subjectId,
            domain,
            action,
            tenantId
          }
        }
      );
      console.log(`[PermissionServiceClient] Permission check response: allowed=${response.data.allowed}`);
      return response.data.allowed;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle specific error cases if needed
        console.error(`[PermissionServiceClient] Permission check failed: ${error.message}`);
      } else {
        console.error(`[PermissionServiceClient] Unexpected error during permission check: ${error}`);
      }
      return false; // Default to denying permission on error
    }
  }
}