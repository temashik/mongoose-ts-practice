import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseContorller } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUsersController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import url from 'url';

@injectable()
export class UsersController extends BaseContorller implements IUsersController {
	constructor(
		@inject(TYPES.UserService) private usersService: IUserService,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', method: 'get', func: this.loginEntry },
			{ path: '/login-success', method: 'post', func: this.login },
			{ path: '/register', method: 'get', func: this.registerEntry },
			{ path: '/register-result', method: 'post', func: this.register },
			{ path: '/', method: 'get', func: this.home },
		]);
	}

	public async login(
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
		const result = await this.usersService.validateUser(req.body);
		if (!result) {
			res.json({
				eMsg: 'Your email or password is invalid',
			});
		} else {
			res.cookie('login', result._id);
			res.redirect(`/`);
		}
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
		const result = await this.usersService.createUser(req.body);
		if (!result) {
			res.json({
				eMsg: 'This email already registered',
			});
			return;
		}
		res.json({
			msg: 'You successfully registered',
		});
	}

	loginEntry(req: Request, res: Response, next: NextFunction): void {
		res.render('front.login.ejs', { title: 'Login' });
	}

	registerEntry(req: Request, res: Response, next: NextFunction): void {
		res.render('front.register.ejs', { title: 'Register' });
	}

	home(req: Request, res: Response, next: NextFunction): void {
		const queryObject = url.parse(req.url, true).query;
		res.render('front.home.ejs', {
			title: 'Homepage',
			user: req.user,
			eMsg: queryObject.eMsg || undefined,
		});
	}
}
