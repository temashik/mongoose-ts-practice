import mongoose, { Schema } from 'mongoose';

export interface IUsers {
	name: string;
	email: string;
	password: string;
	possibilities: number;
}

const users: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	possibilities: { type: Number, required: true },
});

export default mongoose.model<IUsers>('UsersModel', users);
