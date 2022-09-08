import { App } from '../app';
import { boot } from '../main';
import request from 'supertest';
import mongoose from 'mongoose';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users Controller E2e', () => {
	it('Register - success', async () => {
		const res = await request(application.app)
			.post('/register-result')
			.send({ name: 'tester', email: 'test@test', password: 'test', possibilities: 1 });
		expect(res.body.msg).not.toBeUndefined();
	});
});

afterAll(() => {
	mongoose.disconnect(); //issue
	application.close();
});
