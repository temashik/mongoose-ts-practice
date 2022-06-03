import { Request, Response, NextFunction } from 'express';

export interface IDbController {
	create: (req: Request, res: Response, next: NextFunction) => void;
	read: (req: Request, res: Response, next: NextFunction) => void;
	update: (req: Request, res: Response, next: NextFunction) => void;
	delete: (req: Request, res: Response, next: NextFunction) => void;
}
