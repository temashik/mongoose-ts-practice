console.log('qweqw');
declare namespace Express {
	export interface Request {
		user: {
			name: string;
			id: any;
			roots: number;
		} | null;
	}
}
