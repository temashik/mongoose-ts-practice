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
const googleapis_1 = require("googleapis");
const query_string_1 = require("query-string");
require("dotenv/config");
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
            { path: '/gauth', method: 'get', func: this.googleAuth },
            { path: '/gcallback', method: 'get', func: this.gCallback },
            { path: '/fbauth', method: 'get', func: this.facebookAuth },
            { path: '/fbcallback', method: 'get', func: this.fbCallback },
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
        return __awaiter(this, void 0, void 0, function* () {
            const queryObject = url_1.default.parse(req.url, true).query;
            res.render('front.home.ejs', {
                title: 'Homepage',
                user: req.user,
                eMsg: queryObject.eMsg || undefined,
            });
        });
    }
    googleAuth(req, res, next) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2('127659636571-hg34uvk9m0t301f3s4ca21fcnqpv0aek.apps.googleusercontent.com', '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', 'http://localhost:8000/gcallback');
        const redirectUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['email', 'profile'],
        });
        res.redirect(redirectUrl);
    }
    gCallback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const oauth2Client = new googleapis_1.google.auth.OAuth2('127659636571-hg34uvk9m0t301f3s4ca21fcnqpv0aek.apps.googleusercontent.com', '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', 'http://localhost:8000/gcallback');
            const code = req.query.code;
            const { tokens } = yield oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: oauth2Client });
            const userInfo = yield oauth2.userinfo.v2.me.get();
            const data = {
                name: userInfo.data.name,
                email: userInfo.data.email,
                oauth2Id: userInfo.data.id,
            };
            const successLogin = yield this.usersService.createGoogleUser(data, 'Google');
            if (!successLogin) {
                res.json({
                    eMsg: 'Something went wrong',
                });
            }
            else {
                res.cookie('login', successLogin._id);
                res.redirect('/');
            }
        });
    }
    facebookAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const stringifiedParams = (0, query_string_1.stringify)({
                client_id: process.env.CLIENT_ID_FB,
                redirect_uri: 'http://localhost:8000/fbcallback/',
                scope: ['email', 'user_friends'].join(','),
                response_type: 'code',
                auth_type: 'rerequest',
                display: 'popup',
            });
            res.redirect(`https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`);
        });
    }
    fbCallback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = url_1.default.parse(req.url, true).query;
            const accessToken = yield this.usersService.fbGetToken(code.code);
            const data = yield this.usersService.fbGetData(accessToken.access_token);
            const userData = {
                name: data.name,
                email: data.email,
                oauth2Id: data.id,
            };
            const successLogin = yield this.usersService.createGoogleUser(userData, 'Facebook');
            if (!successLogin) {
                res.json({
                    eMsg: 'Something went wrong',
                });
            }
            else {
                res.cookie('login', successLogin._id);
                res.redirect('/');
            }
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