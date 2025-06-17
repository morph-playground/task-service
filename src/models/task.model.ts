export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  userId: string;
}

export interface CreateTaskRequest {
  projectId: string;
  name: string;
  description: string;
}

console.log('Loaded task.model.ts');