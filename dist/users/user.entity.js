"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = require("bcryptjs");
class User {
    constructor(_name, _email, _possibilities, passwordHash, __id, _oauth2Id, _oauth2Type) {
        this._name = _name;
        this._email = _email;
        this._possibilities = _possibilities;
        this.__id = __id;
        this._oauth2Id = _oauth2Id;
        this._oauth2Type = _oauth2Type;
        if (passwordHash) {
            this._password = passwordHash;
        }
    }
    get email() {
        return this._email;
    }
    get name() {
        return this._name;
    }
    get possibilities() {
        return this._possibilities;
    }
    get password() {
        return this._password;
    }
    get _id() {
        return this.__id;
    }
    get oauth2Id() {
        return this._oauth2Id;
    }
    get oauth2Type() {
        return this._oauth2Type;
    }
    setPassword(pass, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            this._password = yield (0, bcryptjs_1.hash)(pass, salt);
        });
    }
    comparePassword(pass) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, bcryptjs_1.compare)(pass, this._password);
        });
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map