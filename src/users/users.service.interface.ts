import { UserLoginDto } from './dto/user-login.dto';
import { UserOauth2Dto } from './dto/user-oauth2.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<boolean>;
	validateUser: (dto: UserLoginDto) => Promise<User | null>;
	createGoogleUser: (dto: UserOauth2Dto, oauth2Type: string) => Promise<User | null>;
	fbGetToken: (code: any) => Promise<any>;
	fbGetData: (accesstoken: any) => Promise<any>;
}
