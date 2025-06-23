export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  userId: string;
}

// Debug: Log creation of task interfaces for troubleshooting


export interface CreateTaskRequest {
  projectId: string;
  name: string;
  description: string;
}