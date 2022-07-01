import { NextFunction, Request, Response } from 'express';
import UsersModel from '../../users/users.model';

export async function declareUser(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (req.cookies.login) {
		const existedUser = await UsersModel.findOne({ _id: req.cookies.login });
		if (existedUser) {
			req.user = {
				name: existedUser.name,
				roots: existedUser.possibilities,
				id: existedUser._id,
			};
		} else {
			req.user = null;
		}
	}
	next();
}
