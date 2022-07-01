"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.appContainer = exports.app = exports.appBindings = void 0;
const inversify_1 = require("inversify");
const app_1 = require("./app");
const database_controller_1 = require("./db/database.controller");
const items_service_1 = require("./db/items.service");
const logger_service_1 = require("./logger/logger.service");
const types_1 = require("./types");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
exports.appBindings = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.ILogger).to(logger_service_1.LoggerService).inSingletonScope();
    bind(types_1.TYPES.Application).to(app_1.App);
    bind(types_1.TYPES.DatabaseController).to(database_controller_1.DatabaseController).inSingletonScope();
    bind(types_1.TYPES.UsersController).to(users_controller_1.UsersController).inSingletonScope();
    bind(types_1.TYPES.UserService).to(users_service_1.UserService);
    bind(types_1.TYPES.ItemsService).to(items_service_1.ItemsService);
});
function bootstrap() {
    const appContainer = new inversify_1.Container();
    appContainer.load(exports.appBindings);
    const app = appContainer.get(types_1.TYPES.Application);
    app.init();
    return { app, appContainer };
}
_a = bootstrap(), exports.app = _a.app, exports.appContainer = _a.appContainer;
//# sourceMappingURL=main.js.map