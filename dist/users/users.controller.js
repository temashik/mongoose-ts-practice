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
exports.UsersController = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const base_controller_1 = require("../common/base.controller");
const types_1 = require("../types");
const users_model_1 = __importDefault(require("./users.model"));
let UsersController = class UsersController extends base_controller_1.BaseContorller {
    constructor(loggerService) {
        super(loggerService);
        this.loggerService = loggerService;
        this.bindRoutes([
            { path: '/login', method: 'get', func: this.loginEntry },
            { path: '/login-success', method: 'post', func: this.login },
            { path: '/register', method: 'get', func: this.registerEntry },
            { path: '/register-result', method: 'post', func: this.register },
        ]);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email || !req.body.password) {
                this.loggerService.warn('Enter email and password for login');
            }
            yield users_model_1.default.find({ email: req.body.email })
                .exec()
                .then((result) => {
                if (result[0].email == req.body.email && result[0].password == req.body.password) {
                    res.render('front.login-success.ejs', {
                        title: 'Welcome',
                        name: result[0].name,
                        possibilities: result[0].possibilities,
                    });
                }
                else if (result[0].email == req.body.email && result[0].password != req.body.password) {
                }
                else {
                }
            })
                .catch((error) => {
                throw error;
            });
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.name || !req.body.email || !req.body.password || !req.body.possibilities) {
                this.loggerService.warn('You must fill all fields');
            }
            yield users_model_1.default.find({ email: req.body.email })
                .exec()
                .then((result) => {
                if (result[0].email == req.body.email) {
                }
            })
                .catch((error) => {
                throw error;
            });
            yield users_model_1.default.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                possibilities: req.body.possibilities,
            })
                .then((result) => {
                res.render('front.register-result.ejs', {
                    title: 'Register Result',
                    name: result.name,
                    email: result.email,
                    password: result.password,
                    possibilities: result.possibilities,
                });
            })
                .catch((error) => {
                throw error;
            });
        });
    }
    loginEntry(req, res, next) {
        res.render('front.login.ejs', { title: 'Login' });
    }
    registerEntry(req, res, next) {
        res.render('front.register.ejs', { title: 'Register' });
    }
};
UsersController = __decorate([
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __metadata("design:paramtypes", [Object])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map