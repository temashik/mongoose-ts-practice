import express, { Express } from 'express';
import { json } from 'body-parser';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { DatabaseController } from './db/database.controller';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import connecting from './db/db_config/db.connect';
import path from 'path';
import consolidate from 'consolidate';
import { UsersController } from './users/users.controller';
import cookieParser from 'cookie-parser';
import { declareUser } from './common/middlewares/user.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.DatabaseController) private dbController: DatabaseController,
		@inject(TYPES.UsersController) private usersController: UsersController,
	) {
		this.app = express();
		this.port = +(process.env.PORT || 8000);
	}

	useRoutes(): void {
		this.app.use('/', this.dbController.router);
		this.app.use('/', this.usersController.router);
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(cookieParser());
		this.app.use(declareUser);
		this.app.use(express.urlencoded());
		this.app.use(express.static(path.join(__dirname, 'front')));
		this.app.engine('html', consolidate.ejs);
		this.app.set('views', __dirname + '/front/pages');
		this.app.set('view engine', 'html');
	}

	public async init(): Promise<void> {
		const db = process.env.DB_URI || 'mongodb://localhost:27017';
		connecting({ db });
		this.useMiddleware();
		this.useRoutes();
		this.server = this.app.listen(this.port);
		this.logger.log('...3...2...1...ZAPUSK');
	}

	public close(): void {
		this.server.close();
	}
}
