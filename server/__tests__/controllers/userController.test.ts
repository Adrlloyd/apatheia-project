import {
  deleteUser,
  updateUserName,
  updateUsername,
  updatePassword,
} from '../../src/controllers/userController';
import { Request, Response } from 'express';
import User from '../../src/models/userModel';
import bcrypt from 'bcryptjs';

jest.mock('../../src/models/userModel');
jest.mock('bcryptjs');

interface AuthenticatedRequest extends Request {
  userId?: string;
}

describe('userController', () => {
  let request: Partial<AuthenticatedRequest>;
  let response: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    request = { body: {}, userId: '123' };
    response = { status: statusMock };

    jest.clearAllMocks();
  });

  describe('deleteUser', () => {
    it('should delete user and return 200', async () => {
      (User.destroy as jest.Mock).mockResolvedValue(1);

      await deleteUser(request as AuthenticatedRequest, response as Response);

      expect(User.destroy).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User account deleted.' });
    });

    it('should return 500 on error', async () => {
      (User.destroy as jest.Mock).mockRejectedValue(new Error('fail'));

      await deleteUser(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Server error.' });
    });
  });

  describe('updateUserName', () => {
    it('should return 400 if name is missing', async () => {
      request.body = {};

      await updateUserName(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Name is required.' });
    });

    it('should return 404 if user not found', async () => {
      request.body = { name: 'Al' };
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await updateUserName(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('should update name and return 200', async () => {
      const mockUser = { name: '', save: jest.fn() };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      request.body = { name: 'Al' };

      await updateUserName(request as AuthenticatedRequest, response as Response);

      expect(mockUser.name).toBe('Al');
      expect(mockUser.save).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Name updated successfully.', name: 'Al' });
    });
  });

  describe('updateUsername', () => {
    it('should return 400 if username is missing', async () => {
      request.body = {};

      await updateUsername(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Username is required.' });
    });

    it('should return 409 if username is taken by another user', async () => {
      request.body = { username: 'existing' };
      (User.findOne as jest.Mock).mockResolvedValue({ id: '999' });

      await updateUsername(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Username already in use.' });
    });

    it('should return 404 if user not found', async () => {
      request.body = { username: 'newuser' };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await updateUsername(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('should update username and return 200', async () => {
      request.body = { username: 'newuser' };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const mockUser = { username: '', save: jest.fn() };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await updateUsername(request as AuthenticatedRequest, response as Response);

      expect(mockUser.username).toBe('newuser');
      expect(mockUser.save).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Username updated successfully.',
        username: 'newuser',
      });
    });
  });

  describe('updatePassword', () => {
    it('should return 400 if passwords are missing', async () => {
      request.body = {};

      await updatePassword(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Both current and new passwords are required.',
      });
    });

    it('should return 404 if user not found', async () => {
      request.body = { currentPassword: 'abc', newPassword: 'abcdef' };
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await updatePassword(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('should return 401 if current password is incorrect', async () => {
      request.body = { currentPassword: 'abc', newPassword: 'abcdef' };
      const mockUser = { password_hash: 'hashed', save: jest.fn() };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await updatePassword(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Current password is incorrect.' });
    });

    it('should return 400 if new password is too short', async () => {
      request.body = { currentPassword: 'abc', newPassword: '123' };
      const mockUser = { password_hash: 'hashed', save: jest.fn() };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await updatePassword(request as AuthenticatedRequest, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'New password must be at least 6 characters long.',
      });
    });

    it('should hash and update password', async () => {
      request.body = { currentPassword: 'abc', newPassword: 'abcdef' };
      const mockUser = { password_hash: 'old', save: jest.fn() };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');

      await updatePassword(request as AuthenticatedRequest, response as Response);

      expect(mockUser.password_hash).toBe('newHashed');
      expect(mockUser.save).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Password updated successfully.',
      });
    });
  });
});