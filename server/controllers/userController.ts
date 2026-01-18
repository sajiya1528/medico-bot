import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
