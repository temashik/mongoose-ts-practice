"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const database_controller_1 = require("./db/database.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("./types");
const db_connect_1 = __importDefault(require("./db/db_config/db.connect"));
const path_1 = __importDefault(require("path"));
const consolidate_1 = __importDefault(require("consolidate"));
let App = class App {
    constructor(logger, dbController) {
        this.logger = logger;
        this.dbController = dbController;
        this.app = (0, express_1.default)();
        this.port = 8000;
    }
    useRoutes() {
        this.app.use('/db', this.dbController.router);
    }
    useMiddleware() {
        this.app.use((0, body_parser_1.json)());
        this.app.use(express_1.default.urlencoded());
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'front')));
        this.app.set('views', __dirname + '/front');
        this.app.engine('html', consolidate_1.default.pug);
        this.app.set('view engine', 'html');
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = 'mongodb://localhost:27017';
            (0, db_connect_1.default)({ db });
            this.useMiddleware();
            this.useRoutes();
            this.server = this.app.listen(this.port);
            this.logger.log('...3...2...1...ZAPUSK');
        });
    }
    close() {
        this.server.close();
    }
};
App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DatabaseController)),
    __metadata("design:paramtypes", [Object, database_controller_1.DatabaseController])
], App);
exports.App = App;
//# sourceMappingURL=app.js.map