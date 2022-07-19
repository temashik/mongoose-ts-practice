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
import { google } from 'googleapis';
import passport from 'passport';
import PassportFacebookToken from 'passport-facebook-token';
import { stringify, parse } from 'query-string';
import 'dotenv/config';
import axios from 'axios';

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
			{ path: '/gauth', method: 'get', func: this.googleAuth },
			{ path: '/gcallback', method: 'get', func: this.gCallback },
			{ path: '/fbauth', method: 'get', func: this.facebookAuth },
			{ path: '/fbcallback', method: 'get', func: this.fbCallback },
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

	async home(req: Request, res: Response, next: NextFunction): Promise<void> {
		const queryObject = url.parse(req.url, true).query;
		res.render('front.home.ejs', {
			title: 'Homepage',
			user: req.user,
			eMsg: queryObject.eMsg || undefined,
		});
	}
	googleAuth(req: Request, res: Response, next: NextFunction): void {
		const oauth2Client = new google.auth.OAuth2(
			'127659636571-hg34uvk9m0t301f3s4ca21fcnqpv0aek.apps.googleusercontent.com',
			'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',
			'http://localhost:8000/gcallback',
		);
		const redirectUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			prompt: 'consent',
			scope: ['email', 'profile'],
		});
		res.redirect(redirectUrl);
	}
	async gCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
		const oauth2Client = new google.auth.OAuth2(
			'127659636571-hg34uvk9m0t301f3s4ca21fcnqpv0aek.apps.googleusercontent.com',
			'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',
			'http://localhost:8000/gcallback',
		);
		const code = req.query.code;
		const { tokens } = await oauth2Client.getToken(code as string);
		oauth2Client.setCredentials(tokens);
		const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
		const userInfo = await oauth2.userinfo.v2.me.get();
		const data = {
			name: userInfo.data.name as string,
			email: userInfo.data.email as string,
			oauth2Id: userInfo.data.id as string,
		};
		const successLogin = await this.usersService.createGoogleUser(data, 'Google');
		if (!successLogin) {
			res.json({
				eMsg: 'Something went wrong',
			});
		} else {
			res.cookie('login', successLogin._id);
			res.redirect('/');
		}
	}
	async facebookAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
		const stringifiedParams = stringify({
			client_id: process.env.CLIENT_ID_FB,
			redirect_uri: 'http://localhost:8000/fbcallback/',
			scope: ['email', 'user_friends'].join(','), // comma seperated string
			response_type: 'code',
			auth_type: 'rerequest',
			display: 'popup',
		});

		res.redirect(`https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`);
	}
	async fbCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
		const code = url.parse(req.url, true).query;
		const accessToken = await this.usersService.fbGetToken(code.code);
		const data = await this.usersService.fbGetData(accessToken.access_token);
		const userData = {
			name: data.name as string,
			email: data.email as string,
			oauth2Id: data.id as string,
		};
		const successLogin = await this.usersService.createGoogleUser(userData, 'Facebook');
		if (!successLogin) {
			res.json({
				eMsg: 'Something went wrong',
			});
		} else {
			res.cookie('login', successLogin._id);
			res.redirect('/');
		}
	}
}
