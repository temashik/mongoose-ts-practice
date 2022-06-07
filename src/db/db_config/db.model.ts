import mongoose, { Schema } from 'mongoose';

export interface IItems {
	name: string;
	cost: number;
	amount: number;
}

const items: Schema = new Schema({
	name: { type: String, required: true },
	cost: { type: Number, required: true },
	amount: { type: Number, required: true },
});

export default mongoose.model<IItems>('ItemsModel', items);
