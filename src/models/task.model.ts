export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  userId: string;
}

 // Debug: Log creation of task interfaces for troubleshooting
console.debug("[DEBUG] task.model.ts loaded: Task and CreateTaskRequest interfaces are available.");

export interface CreateTaskRequest {
  projectId: string;
  name: string;
  description: string;
}