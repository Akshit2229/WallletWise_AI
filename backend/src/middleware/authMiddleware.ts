import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No token provided, authorization denied' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
        const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };

        // Add user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
