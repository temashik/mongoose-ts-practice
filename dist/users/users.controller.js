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
const url_1 = __importDefault(require("url"));
let UsersController = class UsersController extends base_controller_1.BaseContorller {
    constructor(usersService, loggerService) {
        super(loggerService);
        this.usersService = usersService;
        this.loggerService = loggerService;
        this.bindRoutes([
            { path: '/login', method: 'get', func: this.loginEntry },
            { path: '/login-success', method: 'post', func: this.login },
            { path: '/register', method: 'get', func: this.registerEntry },
            { path: '/register-result', method: 'post', func: this.register },
            { path: '/', method: 'get', func: this.home },
        ]);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email || !req.body.password) {
                res.json({
                    eMsg: 'You must fill all fields',
                });
                return;
            }
            const result = yield this.usersService.validateUser(req.body);
            if (!result) {
                res.json({
                    eMsg: 'Your email or password is invalid',
                });
            }
            else {
                res.cookie('login', result._id);
                res.redirect(`/`);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.name || !req.body.email || !req.body.password || !req.body.possibilities) {
                res.json({
                    eMsg: 'You must fill all fields',
                });
                return;
            }
            const result = yield this.usersService.createUser(req.body);
            if (!result) {
                res.json({
                    eMsg: 'This email already registered',
                });
                return;
            }
            res.json({
                msg: 'You successfully registered',
            });
        });
    }
    loginEntry(req, res, next) {
        res.render('front.login.ejs', { title: 'Login' });
    }
    registerEntry(req, res, next) {
        res.render('front.register.ejs', { title: 'Register' });
    }
    home(req, res, next) {
        const queryObject = url_1.default.parse(req.url, true).query;
        res.render('front.home.ejs', {
            title: 'Homepage',
            user: req.user,
            eMsg: queryObject.eMsg || undefined,
        });
    }
};
UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __metadata("design:paramtypes", [Object, Object])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map