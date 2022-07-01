import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<boolean>;
	validateUser: (dto: UserLoginDto) => Promise<User | null>;
}
