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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.declareUser = void 0;
const users_model_1 = __importDefault(require("../../users/users.model"));
function declareUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.login) {
            const existedUser = yield users_model_1.default.findOne({ _id: req.cookies.login });
            if (existedUser) {
                req.user = {
                    name: existedUser.name,
                    roots: existedUser.possibilities,
                    id: existedUser._id,
                };
            }
            else {
                req.user = null;
            }
        }
        next();
    });
}
exports.declareUser = declareUser;
//# sourceMappingURL=user.middleware.js.map