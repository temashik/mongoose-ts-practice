"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const user_entity_1 = require("./user.entity");
const users_model_1 = __importDefault(require("./users.model"));
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
let UserService = class UserService {
    createUser({ name, email, password, possibilities }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_entity_1.User(name, email, possibilities);
            const salt = process.env.SALT || 666;
            yield newUser.setPassword(password, 6);
            const findResult = yield users_model_1.default.findOne({ email: newUser.email });
            if (findResult) {
                return false;
            }
            yield users_model_1.default.create({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                possibilities: newUser.possibilities,
            });
            return true;
        });
    }
    validateUser({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existedUser = yield users_model_1.default.findOne({ email: email });
            if (!existedUser) {
                return null;
            }
            const newUser = new user_entity_1.User(existedUser.name, existedUser.email, existedUser.possibilities, existedUser.password, existedUser._id);
            if (yield newUser.comparePassword(password)) {
                return newUser;
            }
            else {
                return null;
            }
        });
    }
    createGoogleUser({ name, email, oauth2Id }, oauth2Type) {
        return __awaiter(this, void 0, void 0, function* () {
            let existedUser = yield users_model_1.default.findOne({ email, oauth2Id });
            if (!existedUser) {
                yield users_model_1.default.create({ name, email, oauth2Id, oauth2Type });
                existedUser = yield users_model_1.default.findOne({ email, oauth2Id });
            }
            if (existedUser == null) {
                return null;
            }
            return new user_entity_1.User(existedUser.name, existedUser.email, undefined, undefined, existedUser._id, existedUser.oauth2Id, existedUser.oauth2Type);
        });
    }
    fbGetToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield (0, axios_1.default)({
                url: 'https://graph.facebook.com/v4.0/oauth/access_token',
                method: 'get',
                params: {
                    client_id: process.env.CLIENT_ID_FB,
                    client_secret: process.env.CLIENT_SECRET_FB,
                    redirect_uri: 'http://localhost:8000/fbcallback/',
                    code,
                },
            });
            return data;
        });
    }
    fbGetData(accesstoken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield (0, axios_1.default)({
                url: 'https://graph.facebook.com/me',
                method: 'get',
                params: {
                    fields: ['id', 'email', 'name'].join(','),
                    access_token: accesstoken,
                },
            });
            return data;
        });
    }
};
UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=users.service.js.map