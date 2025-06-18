import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { generateToken } from '../utils/generateToken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, password } = req.body;

    if (!name || !password) {
      res.status(400).json({ message: 'Name and password are required.' });
      return;
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      password_hash,
    });

    const token = generateToken({ userId: newUser.id, name: newUser.name });

    res.status(201).json({
      message: 'Registration successful.',
      token,
      name: newUser.name,
      id: newUser.id,
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password required.' });
      return;
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = generateToken({ userId: user.id, name: user.name });

    res.status(200).json({
      message: 'Login successful.',
      token,
      name: user.name,
      id: user.id,
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};