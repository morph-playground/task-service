import { createApp } from './app';

console.log('[DEBUG] Starting server setup...');
const PORT = process.env.PORT || 3000;

const PERMISSION_SERVICE_HOST = process.env.PERMISSION_SERVICE_HOST || 'localhost';
const PERMISSION_SERVICE_PORT = parseInt(process.env.PERMISSION_SERVICE_PORT || '3001', 10);

console.log(`[DEBUG] Config: PERMISSION_SERVICE_HOST=${PERMISSION_SERVICE_HOST}, PERMISSION_SERVICE_PORT=${PERMISSION_SERVICE_PORT}, PORT=${PORT}`);

const app = createApp({
  host: PERMISSION_SERVICE_HOST,
  port: PERMISSION_SERVICE_PORT
});

console.log('[DEBUG] App instance created. Attempting to listen...');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});