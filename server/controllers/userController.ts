import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    await User.destroy({ where: { id: userId } });

    res.status(200).json({ message: 'User account deleted.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updateUserName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Name is required.' });
      return;
    }

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    user.name = name;
    await user.save();

    res.status(200).json({ message: 'Name updated successfully.', name: user.name });
  } catch (error) {
    console.error('Error updating name:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updateUsername = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ message: 'Username is required.' });
      return;
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser && existingUser.id !== userId) {
      res.status(409).json({ message: 'Username already in use.' });
      return;
    }

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    user.username = username;
    await user.save();

    res.status(200).json({ message: 'Username updated successfully.', username: user.username });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Both current and new passwords are required.' });
      return;
    }

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Current password is incorrect.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters long.' });
      return;
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = newHashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};