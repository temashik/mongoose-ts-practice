import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseContorller } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUsersController } from './users.controller.interface';
import UsersModel from './users.model';
import { hash } from 'bcryptjs';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

export class UsersController extends BaseContorller implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', method: 'get', func: this.loginEntry },
			{ path: '/login-success', method: 'post', func: this.login },
			{ path: '/register', method: 'get', func: this.registerEntry },
			{ path: '/register-result', method: 'post', func: this.register },
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (!req.body.email || !req.body.password) {
			res.json({
				eMsg: 'You must fill all fields',
			});
			return;
		}

		const salt = process.env.SALT || 666;

		const password = hash(req.body.password, salt);

		await UsersModel.find({ email: req.body.email })
			.exec()
			.then((result) => {
				if (
					result.length == 0 ||
					(result[0].email == req.body.email && result[0].password != req.body.password)
				) {
					res.json({
						eMsg: 'Your email or password is invalid',
					});
					return;
				} else if (result[0].email == req.body.email && result[0].password == req.body.password) {
					res.cookie('Test_Cookie', 'test');
					res.render('front.login-success.ejs', {
						title: 'Welcome',
						name: result[0].name,
						possibilities: result[0].possibilities,
					});
				}
			})
			.catch((error: Error) => {
				res.json({
					err: error.message,
				});
				return;
			});
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (!req.body.name || !req.body.email || !req.body.password || !req.body.possibilities) {
			res.json({
				eMsg: 'You must fill all fields',
			});
			return;
		}
		let shouldStopProccess = false;

		await UsersModel.find({ email: req.body.email })
			.exec()
			.then((result) => {
				if (result.length > 0) {
					res.json({
						eMsg: 'This email already registered',
					});
					shouldStopProccess = true;
				}
			})
			.catch((error: Error) => {
				res.json({
					err: error.message,
				});
				return;
			});

		if (shouldStopProccess) {
			return;
		}

		await UsersModel.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			possibilities: req.body.possibilities,
		})
			.then((result) => {
				res.json({
					msg: 'You successfully registered',
				});
				return;
			})
			.catch((error: Error) => {
				res.json({
					err: error.message,
				});
				return;
			});
	}

	loginEntry(req: Request, res: Response, next: NextFunction): void {
		res.render('front.login.ejs', { title: 'Login' });
	}

	registerEntry(req: Request, res: Response, next: NextFunction): void {
		res.render('front.register.ejs', { title: 'Register' });
	}
}
