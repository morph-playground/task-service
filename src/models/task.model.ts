export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  userId: string;
}

// Debug: Log creation of task interfaces for troubleshooting
console.log("[DEBUG] task.model.ts loaded: Task and CreateTaskRequest interfaces are available.");

export interface CreateTaskRequest {
  projectId: string;
  name: string;
  description: string;
}