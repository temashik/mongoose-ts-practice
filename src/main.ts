import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { DatabaseController } from './db/database.controller';
import { IDbController } from './db/database.controller.interface';
import { ItemsService } from './db/items.service';
import { IItemsService } from './db/items.service.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';
import { IUsersController } from './users/users.controller.interface';
import { UserService } from './users/users.service';
import { IUserService } from './users/users.service.interface';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
	bind<IDbController>(TYPES.DatabaseController).to(DatabaseController).inSingletonScope();
	bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IItemsService>(TYPES.ItemsService).to(ItemsService);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
