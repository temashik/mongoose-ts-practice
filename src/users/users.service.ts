import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './users.service.interface';
import UsersModel from './users.model';

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
}
