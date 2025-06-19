import { registerUser, loginUser } from '../../src/controllers/authController';
import { Request, Response } from 'express';
import User from '../../src/models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../src/utils/generateToken';

jest.mock('../../src/models/userModel');
jest.mock('bcryptjs');
jest.mock('../../src/utils/generateToken');

describe('authController', () => {
  let request: Partial<Request>;
  let response: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    request = { body: {} };
    response = { status: statusMock };

    jest.clearAllMocks();
  });

  // --- registerUser tests ---

  describe('registerUser', () => {
    it('should return 400 if name or password is missing', async () => {
      request.body = { name: '', username: 'testuser', password: '' };

      await registerUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Name and password are required.' });
    });

    it('should return 409 if username already exists', async () => {
      request.body = { name: 'Test', username: 'existinguser', password: 'validpass' };
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await registerUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User already exists.' });
    });

    it('should return 400 if password is less than 6 characters', async () => {
      request.body = { name: 'Test', username: 'newuser', password: '123' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await registerUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Password must be at least 6 characters long.',
      });
    });

    it('should create user and return 201 with token', async () => {
      request.body = { name: 'Test', username: 'newuser', password: 'validpass' };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.create as jest.Mock).mockResolvedValue({ id: 1, name: 'Test', username: 'newuser' });
      (generateToken as jest.Mock).mockReturnValue('mockedToken');

      await registerUser(request as Request, response as Response);

      expect(User.create).toHaveBeenCalledWith({
        name: 'Test',
        username: 'newuser',
        password_hash: 'hashedPassword',
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Registration successful.',
        token: 'mockedToken',
        name: 'Test',
        id: 1,
      });
    });

    it('should return 500 if an error is thrown', async () => {
      request.body = { name: 'Test', username: 'erroruser', password: 'validpass' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

      await registerUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
  });

  describe('loginUser', () => {
    it('should return 400 if username or password is missing', async () => {
      request.body = { username: '', password: '' };

      await loginUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Username and password required.' });
    });

    it('should return 401 if user is not found', async () => {
      request.body = { username: 'ghost', password: 'password' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await loginUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
    });

    it('should return 401 if password does not match', async () => {
      request.body = { username: 'testuser', password: 'wrongpass' };
      (User.findOne as jest.Mock).mockResolvedValue({ password_hash: 'hashedpass', id: 1, name: 'Test' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await loginUser(request as Request, response as Response);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpass', 'hashedpass');
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
    });

    it('should return 200 with token if login is successful', async () => {
      request.body = { username: 'testuser', password: 'rightpass' };
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Test', password_hash: 'hashedpass' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mockedToken');

      await loginUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Login successful.',
        token: 'mockedToken',
        name: 'Test',
        id: 1,
      });
    });

    it('should return 500 if an error is thrown', async () => {
      request.body = { username: 'testuser', password: 'pass' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

      await loginUser(request as Request, response as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
  });
});