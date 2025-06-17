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
    console.debug(`[PermissionServiceClient] Initialized with baseUrl: ${this.baseUrl}`);
  }

  async hasPermission(subjectId: string, domain: Domain, action: Action): Promise<boolean> {
    console.debug(`[PermissionServiceClient] Checking permission for subjectId=${subjectId}, domain=${domain}, action=${action}`);
    try {
      const response = await axios.get<PermissionResponse>(
        `${this.baseUrl}/permissions/check`,
        {
          params: {
            subjectId,
            domain,
            action
          }
        }
      );
      console.debug(`[PermissionServiceClient] Permission check response: allowed=${response.data.allowed}`);
      return response.data.allowed;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle specific error cases if needed
        console.debug(`[PermissionServiceClient] Permission check failed: ${error.message}`);
      } else {
        console.debug(`[PermissionServiceClient] Unexpected error during permission check: ${error}`);
      }
      return false; // Default to denying permission on error
    }
  }
}