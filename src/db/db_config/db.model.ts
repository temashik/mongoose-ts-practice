import mongoose, { Schema, Types } from 'mongoose';

export interface IItems {
	name: string;
	cost: number;
	amount: number;
	user: any;
}

export interface IId {
	_id: Types.ObjectId;
}

export type ID = Types.ObjectId;

const items: Schema = new Schema({
	name: { type: String, required: true },
	cost: { type: Number, required: true },
	amount: { type: Number, required: true },
	user: { type: String, required: true, ref: 'User' },
});

export default mongoose.model<IItems>('ItemsModel', items);
