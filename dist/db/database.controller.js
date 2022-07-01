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
exports.DatabaseController = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const base_controller_1 = require("../common/base.controller");
const types_1 = require("../types");
const url_1 = __importDefault(require("url"));
let DatabaseController = class DatabaseController extends base_controller_1.BaseContorller {
    constructor(loggerService, itemsService) {
        super(loggerService);
        this.loggerService = loggerService;
        this.itemsService = itemsService;
        this.bindRoutes([
            { path: '/create-result', method: 'post', func: this.create },
            { path: '/read-result', method: 'post', func: this.read },
            { path: '/update-result', method: 'post', func: this.update },
            { path: '/delete-result', method: 'post', func: this.delete },
            { path: '/create', method: 'get', func: this.createData },
            { path: '/read', method: 'get', func: this.readData },
            { path: '/update', method: 'post', func: this.updateData },
            { path: '/update', method: 'get', func: this.updateData },
            { path: '/delete', method: 'get', func: this.deleteData },
            { path: '/items', method: 'get', func: this.items },
        ]);
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.name || !req.body.cost || !req.body.amount) {
                res.json({
                    eMsg: 'You must fill all fields',
                });
                return;
            }
            const createdItem = yield this.itemsService.createItems(req.body, req.cookies.login);
            if (!createdItem) {
                res.json({
                    eMsg: 'Item with same name already exist',
                });
            }
            else {
                res.json({
                    _id: createdItem._id,
                });
            }
        });
    }
    read(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && !((_b = req.body) === null || _b === void 0 ? void 0 : _b.cost) && !((_c = req.body) === null || _c === void 0 ? void 0 : _c.amount)) {
                res.json({
                    eMsg: 'Cant find any document, enter at least 1 key to find',
                });
                return;
            }
            const findedItems = yield this.itemsService.findItems(req.body);
            if (!findedItems) {
                res.json({
                    eMsg: 'We found nothing, try again',
                });
            }
            else {
                res.render('front.read-result.ejs', {
                    title: 'Read',
                    result: findedItems,
                });
            }
        });
    }
    update(req, res, next) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && !((_b = req.body) === null || _b === void 0 ? void 0 : _b.cost) && !((_c = req.body) === null || _c === void 0 ? void 0 : _c.amount)) {
                res.json({
                    eMsg: 'What you want to change?',
                });
                return;
            }
            if (!((_d = req.body) === null || _d === void 0 ? void 0 : _d.newName) && !((_e = req.body) === null || _e === void 0 ? void 0 : _e.newCost) && !((_f = req.body) === null || _f === void 0 ? void 0 : _f.newAmount)) {
                res.json({
                    eMsg: 'What change you want to do?',
                });
                return;
            }
            const updatedItems = yield this.itemsService.updateItems(req.body, req.cookies.login);
            if (!updatedItems) {
                res.json({
                    eMsg: 'Nothing was updated',
                });
            }
            else {
                res.render('front.read-result.ejs', {
                    title: 'Updating result',
                    result: updatedItems,
                });
            }
        });
    }
    delete(req, res, next) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && !((_b = req.body) === null || _b === void 0 ? void 0 : _b.cost) && !((_c = req.body) === null || _c === void 0 ? void 0 : _c.amount) && !((_d = req.body) === null || _d === void 0 ? void 0 : _d._id)) {
                res.json({
                    eMsg: 'Cant find any document to delete, enter at least 1 key to find',
                });
                return;
            }
            const isDeleted = yield this.itemsService.deleteItem(req.body, req.cookies.login);
            if (!isDeleted) {
                res.json({
                    eMsg: 'Nothing was deleted',
                });
            }
            else {
                res.json({
                    msg: 'Document was successfully deleted',
                });
            }
        });
    }
    createData(req, res, next) {
        if (!req.cookies.login) {
            res.redirect(`/?eMsg=You are not authorized`);
        }
        else {
            res.render('front.create.ejs', { title: 'Create' });
        }
    }
    readData(req, res, next) {
        if (!req.cookies.login) {
            res.redirect(`/?eMsg=You are not authorized`);
        }
        else {
            res.render('front.read.ejs', { title: 'Read' });
        }
    }
    updateData(req, res, next) {
        var _a, _b, _c;
        if (!req.cookies.login) {
            res.redirect(`/?eMsg=You are not authorized`);
        }
        else {
            res.render('front.update.ejs', {
                title: 'Update',
                name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
                cost: (_b = req.body) === null || _b === void 0 ? void 0 : _b.cost,
                amount: (_c = req.body) === null || _c === void 0 ? void 0 : _c.amount,
            });
        }
    }
    deleteData(req, res, next) {
        if (!req.cookies.login) {
            res.redirect(`/?eMsg=You are not authorized`);
        }
        else {
            res.render('front.delete.ejs', { title: 'Delete' });
        }
    }
    items(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryObject = url_1.default.parse(req.url, true).query;
            const item = yield this.itemsService.getItem(queryObject);
            res.render('front.items.ejs', {
                title: 'Items',
                name: item.name,
                cost: item.cost,
                amount: item.amount,
                _id: item._id,
            });
        });
    }
};
DatabaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ItemsService)),
    __metadata("design:paramtypes", [Object, Object])
], DatabaseController);
exports.DatabaseController = DatabaseController;
//# sourceMappingURL=database.controller.js.map