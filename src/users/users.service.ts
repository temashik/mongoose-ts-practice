import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';
import UsersModel from './users.model';
import { UserOauth2Dto } from './dto/user-oauth2.dto';
import axios from 'axios';
import 'dotenv/config';

@injectable()
export class UserService implements IUserService {
	async createUser({ name, email, password, possibilities }: UserRegisterDto): Promise<boolean> {
		const newUser = new User(name, email, possibilities);
		const salt = process.env.SALT || 666;
		await newUser.setPassword(password, 6);
		const findResult = await UsersModel.findOne({ email: newUser.email });
		if (findResult) {
			return false;
		}
		await UsersModel.create({
			name: newUser.name,
			email: newUser.email,
			password: newUser.password,
			possibilities: newUser.possibilities,
		});
		return true;
	}

	async validateUser({ email, password }: UserLoginDto): Promise<User | null> {
		const existedUser = await UsersModel.findOne({ email: email });
		if (!existedUser) {
			return null;
		}
		const newUser = new User(
			existedUser.name,
			existedUser.email,
			existedUser.possibilities,
			existedUser.password,
			existedUser._id,
		);
		if (await newUser.comparePassword(password)) {
			return newUser;
		} else {
			return null;
		}
	}

	async createGoogleUser(
		{ name, email, oauth2Id }: UserOauth2Dto,
		oauth2Type: string,
	): Promise<User | null> {
		let existedUser = await UsersModel.findOne({ email, oauth2Id });
		if (!existedUser) {
			await UsersModel.create({ name, email, oauth2Id, oauth2Type });
			existedUser = await UsersModel.findOne({ email, oauth2Id });
		}
		if (existedUser == null) {
			return null;
		}
		return new User(
			existedUser.name,
			existedUser.email,
			undefined,
			undefined,
			existedUser._id,
			existedUser.oauth2Id,
			existedUser.oauth2Type,
		);
	}

	async fbGetToken(code: any): Promise<any> {
		const { data } = await axios({
			url: 'https://graph.facebook.com/v4.0/oauth/access_token',
			method: 'get',
			params: {
				client_id: process.env.CLIENT_ID_FB,
				client_secret: process.env.CLIENT_SECRET_FB,
				redirect_uri: 'http://localhost:8000/fbcallback/',
				code,
			},
		});
		return data;
	}

	async fbGetData(accesstoken: any): Promise<any> {
		const { data } = await axios({
			url: 'https://graph.facebook.com/me',
			method: 'get',
			params: {
				fields: ['id', 'email', 'name'].join(','),
				access_token: accesstoken,
			},
		});
		return data;
	}
}
