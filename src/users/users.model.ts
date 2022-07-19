import mongoose, { Schema } from 'mongoose';

export interface IUsers {
	name: string;
	email: string;
	password: string;
	possibilities: number;
	oauth2Id: string;
	oauth2Type: string;
}

const users: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: false },
	possibilities: { type: Number, required: false },
	oauth2Id: { type: String, required: false },
	oauth2Type: { type: String, require: false },
});

export default mongoose.model<IUsers>('UsersModel', users);
