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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routes_1 = require("./routes/routes");
class App {
    constructor(logger) {
        this.app = (0, express_1.default)();
        this.port = 8000;
        this.logger = logger;
    }
    useRoutes() {
        this.app.use('/db', routes_1.router);
    }
    useMiddleware() {
        this.app.use((0, body_parser_1.json)());
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useMiddleware();
            this.useRoutes();
            this.server = this.app.listen(this.port);
            this.logger.log('...3...2...1...ZAPUSK');
        });
    }
    close() {
        this.server.close();
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map