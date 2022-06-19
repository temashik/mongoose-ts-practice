import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser({
		email,
		name,
		password,
		possibilities,
	}: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name, possibilities);
		await newUser.setPassword(password, Number(process.env.SALT || 666));
		let shouldStopProccess = false;

		await UsersModel.find({ email: email })
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
		return null;
	}

	validateUser(dto: UserLoginDto): boolean {
		return true;
	}
}
