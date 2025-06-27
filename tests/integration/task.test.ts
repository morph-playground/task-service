import request from 'supertest';
import express from 'express';
import nock from 'nock';
import { createApp } from '../../src/app';

const permissionServiceHost = 'localhost';
const permissionServicePort = 3001;
const permissionServiceBaseUrl = `http://${permissionServiceHost}:${permissionServicePort}`;

describe('Task Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp({ host: permissionServiceHost, port: permissionServicePort });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('POST /tasks', () => {
    it('should create a task when user has permission', async () => {
      const userId = 'user-123';
      const tenantId = 'tenant-abc';
      const taskData = {
        projectId: 'project-456',
        name: 'Test Task',
        description: 'Test task description'
      };

      // Mock permission service to allow CREATE
      nock(permissionServiceBaseUrl)
        .get('/permissions/v2/check')
        .query({
          subjectId: userId,
          tenantId: tenantId,
          domain: 'TASK',
          action: 'CREATE'
        })
        .reply(200, { allowed: true });

      const response = await request(app)
        .post('/tasks')
        .set('identity-user-id', userId)
        .set('identity-tenant-id', tenantId)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        projectId: taskData.projectId,
        name: taskData.name,
        description: taskData.description,
        userId: userId,
        tenantId: tenantId
      });
      expect(response.body.id).toBeDefined();
    });

    it('should return 401 when user ID or tenant ID is not provided', async () => {
      const taskData = {
        projectId: 'project-456',
        name: 'Test Task',
        description: 'Test task description'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'User ID or Tenant ID not provided' });
    });

    it('should return 403 when user does not have permission', async () => {
      const userId = 'user-123';
      const tenantId = 'tenant-abc';
      const taskData = {
        projectId: 'project-456',
        name: 'Test Task',
        description: 'Test task description'
      };

      // Mock permission service to deny CREATE
      nock(permissionServiceBaseUrl)
        .get('/permissions/v2/check')
        .query({
          subjectId: userId,
          tenantId: tenantId,
          domain: 'TASK',
          action: 'CREATE'
        })
        .reply(200, { allowed: false });

      const response = await request(app)
        .post('/tasks')
        .set('identity-user-id', userId)
        .set('identity-tenant-id', tenantId)
        .send(taskData);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Insufficient permissions');
    });
  });

  describe('GET /tasks', () => {
    it('should get tasks when user has permission', async () => {
      const userId = 'user-123';
      const tenantId = 'tenant-abc';

      // Mock permission service to allow LIST
      nock(permissionServiceBaseUrl)
        .get('/permissions/v2/check')
        .query({
          subjectId: userId,
          tenantId: tenantId,
          domain: 'TASK',
          action: 'LIST'
        })
        .reply(200, { allowed: true });

      const response = await request(app)
        .get('/tasks')
        .set('identity-user-id', userId)
        .set('identity-tenant-id', tenantId);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 when user ID or tenant ID is not provided', async () => {
      const response = await request(app)
        .get('/tasks');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'User ID or Tenant ID not provided' });
    });

    it('should return 403 when user does not have permission', async () => {
      const userId = 'user-123';
      const tenantId = 'tenant-abc';

      // Mock permission service to deny LIST
      nock(permissionServiceBaseUrl)
        .get('/permissions/v2/check')
        .query({
          subjectId: userId,
          tenantId: tenantId,
          domain: 'TASK',
          action: 'LIST'
        })
        .reply(200, { allowed: false });

      const response = await request(app)
        .get('/tasks')
        .set('identity-user-id', userId)
        .set('identity-tenant-id', tenantId);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Insufficient permissions');
    });

    it('should return only tasks created by the user and tenant', async () => {
      const userId1 = 'user-123';
      const userId2 = 'user-456';
      const tenantId1 = 'tenant-abc';
      const tenantId2 = 'tenant-xyz';
      const taskData = {
        projectId: 'project-789',
        name: 'User Task',
        description: 'Task for specific user'
      };

      // Create task for user1 in tenant1
      nock(permissionServiceBaseUrl)
        .get('/permissions/v2/check')
        .query({
          subjectId: userId1,
          tenantId: tenantId1,
          domain: 'TASK',
          action: 'CREATE'
        })
        .reply(200, { allowed: true });

      await request(app)
        .post('/tasks')
        .set('identity-user-id', userId1)
        .set('identity-tenant-id', tenantId1)
        .send(taskData);

      // Get tasks for user2 in tenant2 (should be empty)
      nock(permissionServiceBaseUrl)
        .get('/permissions/v2/check')
        .query({
          subjectId: userId2,
          tenantId: tenantId2,
          domain: 'TASK',
          action: 'LIST'
        })
        .reply(200, { allowed: true });

      const response = await request(app)
        .get('/tasks')
        .set('identity-user-id', userId2)
        .set('identity-tenant-id', tenantId2);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});