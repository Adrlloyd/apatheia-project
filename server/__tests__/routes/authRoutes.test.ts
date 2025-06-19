import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../src/utils/generateToken';

jest.mock('bcryptjs');
jest.mock('../../src/utils/generateToken');

describe('Auth Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/register', () => {
    it('should return 400 if name or password is missing', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({ name: '', username: 'user', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name and password are required.');
    });

    it('should return 409 if username already exists', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({ id: 1 } as any);

      const response = await request(app)
        .post('/api/register')
        .send({ name: 'Al', username: 'taken', password: 'password123' });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('User already exists.');
    });

    it('should return 400 if password is too short', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/register')
        .send({ name: 'Al', username: 'newuser', password: '123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password must be at least 6 characters long.');
    });

    it('should register user and return 201 with token', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');
      jest.spyOn(User, 'create').mockResolvedValueOnce({
        id: 1,
        name: 'Al',
        username: 'newuser',
      } as any);
      (generateToken as jest.Mock).mockReturnValue('mockedToken');

      const response = await request(app)
        .post('/api/register')
        .send({ name: 'Al', username: 'newuser', password: 'validpassword' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Registration successful.',
        token: 'mockedToken',
        name: 'Al',
        id: 1,
      });
    });
  });

  describe('POST /api/login', () => {
    it('should return 400 if username or password is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password required.');
    });

    it('should return 401 if user is not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/login')
        .send({ username: 'missinguser', password: 'whatever' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials.');
    });

    it('should return 401 if password is incorrect', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({ password_hash: 'hashed' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/login')
        .send({ username: 'user', password: 'wrongpass' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials.');
    });

    it('should return 200 and token on successful login', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({
        id: 1,
        name: 'Al',
        password_hash: 'hashedpass',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mockedToken');

      const response = await request(app)
        .post('/api/login')
        .send({ username: 'user', password: 'correctpass' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Login successful.',
        token: 'mockedToken',
        name: 'Al',
        id: 1,
      });
    });
  });
});