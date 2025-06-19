import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/userModel';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

// ✅ Mock the token middleware so it always injects userId = 1
jest.mock('../../src/middleware/verifyToken', () => (req: any, res: any, next: any) => {
  req.userId = 1;
  next();
});

describe('User Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE /api/users', () => {
    it('should delete the user and return 200', async () => {
      jest.spyOn(User, 'destroy').mockResolvedValueOnce(1 as any);

      const response = await request(app)
        .delete('/api/users')
        .set('Authorization', 'Bearer dummy');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User account deleted.');
    });
  });

  describe('PUT /api/users/update-name', () => {
    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .put('/api/users/update-name')
        .set('Authorization', 'Bearer dummy')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required.');
    });

    it('should update user name and return 200', async () => {
      const mockUser = { name: '', save: jest.fn() };
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser as any);

      const response = await request(app)
        .put('/api/users/update-name')
        .set('Authorization', 'Bearer dummy')
        .send({ name: 'Alastair' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Name updated successfully.');
    });
  });

  describe('PUT /api/users/update-username', () => {
    it('should return 400 if username is missing', async () => {
      const response = await request(app)
        .put('/api/users/update-username')
        .set('Authorization', 'Bearer dummy')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username is required.');
    });

    it('should return 409 if username is already taken', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({ id: 2 } as any);

      const response = await request(app)
        .put('/api/users/update-username')
        .set('Authorization', 'Bearer dummy')
        .send({ username: 'existinguser' });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Username already in use.');
    });

    it('should update username and return 200', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      const mockUser = { username: '', save: jest.fn() };
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser as any);

      const response = await request(app)
        .put('/api/users/update-username')
        .set('Authorization', 'Bearer dummy')
        .send({ username: 'newuser' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Username updated successfully.');
    });
  });

  describe('PUT /api/users/update-password', () => {
    it('should return 400 if passwords are missing', async () => {
      const response = await request(app)
        .put('/api/users/update-password')
        .set('Authorization', 'Bearer dummy')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Both current and new passwords are required.');
    });

    it('should return 401 if current password is incorrect', async () => {
      const mockUser = { password_hash: 'hashed' };
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .put('/api/users/update-password')
        .set('Authorization', 'Bearer dummy')
        .send({ currentPassword: 'wrong', newPassword: 'newpass' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Current password is incorrect.');
    });

    it('should return 400 if new password is too short', async () => {
      const mockUser = { password_hash: 'hashed' };
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .put('/api/users/update-password')
        .set('Authorization', 'Bearer dummy')
        .send({ currentPassword: 'valid', newPassword: '123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('New password must be at least 6 characters long.');
    });

    it('should update password and return 200', async () => {
      const mockUser = { password_hash: 'hashed', save: jest.fn() };
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');

      const response = await request(app)
        .put('/api/users/update-password')
        .set('Authorization', 'Bearer dummy')
        .send({ currentPassword: 'valid', newPassword: 'newpass123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password updated successfully.');
    });
  });
});