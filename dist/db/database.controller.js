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
const db_model_1 = __importDefault(require("./db_config/db.model"));
const url_1 = __importDefault(require("url"));
let DatabaseController = class DatabaseController extends base_controller_1.BaseContorller {
    constructor(loggerService) {
        super(loggerService);
        this.loggerService = loggerService;
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
            yield db_model_1.default.create({
                name: req.body.name,
                cost: req.body.cost,
                amount: req.body.amount,
            })
                .then((result) => {
                res.render('front.create-result.ejs', {
                    title: 'Create',
                    name: result.name,
                    cost: result.cost,
                    amount: result.amount,
                });
            })
                .catch((error) => {
                throw error;
            });
        });
    }
    read(req, res, next) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && !((_b = req.body) === null || _b === void 0 ? void 0 : _b.cost) && !((_c = req.body) === null || _c === void 0 ? void 0 : _c.amount)) {
                this.loggerService.warn('No args for search');
            }
            const query = db_model_1.default.find();
            if ((_d = req.body) === null || _d === void 0 ? void 0 : _d.name) {
                query.where('name').equals((_e = req.body) === null || _e === void 0 ? void 0 : _e.name);
            }
            if ((_f = req.body) === null || _f === void 0 ? void 0 : _f.cost) {
                query.where('cost').equals((_g = req.body) === null || _g === void 0 ? void 0 : _g.cost);
            }
            if ((_h = req.body) === null || _h === void 0 ? void 0 : _h.amount) {
                query.where('amount').equals((_j = req.body) === null || _j === void 0 ? void 0 : _j.amount);
            }
            yield query
                .exec()
                .then((result) => {
                res.render('front.read-result.ejs', {
                    title: 'Read',
                    result: result,
                });
            })
                .catch((error) => {
                throw error;
            });
        });
    }
    update(req, res, next) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && !((_b = req.body) === null || _b === void 0 ? void 0 : _b.cost) && !((_c = req.body) === null || _c === void 0 ? void 0 : _c.amount)) {
                this.loggerService.warn('What you want to change?');
            }
            if (!((_d = req.body) === null || _d === void 0 ? void 0 : _d.newName) && !((_e = req.body) === null || _e === void 0 ? void 0 : _e.newCost) && !((_f = req.body) === null || _f === void 0 ? void 0 : _f.newAmount)) {
                this.loggerService.warn('What change you want to do?');
            }
            const query = db_model_1.default.where();
            if ((_g = req.body) === null || _g === void 0 ? void 0 : _g.name) {
                query.where('name').equals((_h = req.body) === null || _h === void 0 ? void 0 : _h.name);
            }
            if ((_j = req.body) === null || _j === void 0 ? void 0 : _j.cost) {
                query.where('cost').equals((_k = req.body) === null || _k === void 0 ? void 0 : _k.cost);
            }
            if ((_l = req.body) === null || _l === void 0 ? void 0 : _l.amount) {
                query.where('amount').equals((_m = req.body) === null || _m === void 0 ? void 0 : _m.amount);
            }
            if (((_o = req.body) === null || _o === void 0 ? void 0 : _o.newName) != '') {
                query.updateMany({ name: (_p = req.body) === null || _p === void 0 ? void 0 : _p.newName });
            }
            if (((_q = req.body) === null || _q === void 0 ? void 0 : _q.newAmount) != '') {
                query.updateMany({ amount: (_r = req.body) === null || _r === void 0 ? void 0 : _r.newAmount });
            }
            if (((_s = req.body) === null || _s === void 0 ? void 0 : _s.newCost) != '') {
                query.updateMany({ cost: (_t = req.body) === null || _t === void 0 ? void 0 : _t.newCost });
            }
            yield query
                .exec()
                .then((result) => {
                res.json(result);
            })
                .catch((error) => {
                throw error;
            });
        });
    }
    delete(req, res, next) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && !((_b = req.body) === null || _b === void 0 ? void 0 : _b.cost) && !((_c = req.body) === null || _c === void 0 ? void 0 : _c.amount) && !((_d = req.body) === null || _d === void 0 ? void 0 : _d._id)) {
                this.loggerService.warn('Cant find document to delete');
            }
            const query = db_model_1.default.where();
            if ((_e = req.body) === null || _e === void 0 ? void 0 : _e.name) {
                query.where('name').equals((_f = req.body) === null || _f === void 0 ? void 0 : _f.name);
            }
            if ((_g = req.body) === null || _g === void 0 ? void 0 : _g.cost) {
                query.where('cost').equals((_h = req.body) === null || _h === void 0 ? void 0 : _h.cost);
            }
            if ((_j = req.body) === null || _j === void 0 ? void 0 : _j.amount) {
                query.where('amount').equals((_k = req.body) === null || _k === void 0 ? void 0 : _k.amount);
            }
            if ((_l = req.body) === null || _l === void 0 ? void 0 : _l._id) {
                query.where('_id').equals((_m = req.body) === null || _m === void 0 ? void 0 : _m._id);
            }
            yield query
                .deleteMany()
                .exec()
                .then((result) => {
                res.json(result);
            })
                .catch((error) => {
                throw error;
            });
        });
    }
    createData(req, res, next) {
        res.render('front.create.ejs', { title: 'Create' });
    }
    readData(req, res, next) {
        res.render('front.read.ejs', { title: 'Read' });
    }
    updateData(req, res, next) {
        var _a, _b, _c;
        res.render('front.update.ejs', {
            title: 'Update',
            name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
            cost: (_b = req.body) === null || _b === void 0 ? void 0 : _b.cost,
            amount: (_c = req.body) === null || _c === void 0 ? void 0 : _c.amount,
        });
    }
    deleteData(req, res, next) {
        res.render('front.delete.ejs', { title: 'Delete' });
    }
    items(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryObject = url_1.default.parse(req.url, true).query;
            const query = db_model_1.default.find();
            if (queryObject === null || queryObject === void 0 ? void 0 : queryObject.name) {
                query.where('name').equals(queryObject === null || queryObject === void 0 ? void 0 : queryObject.name);
            }
            if (queryObject === null || queryObject === void 0 ? void 0 : queryObject.cost) {
                query.where('cost').equals(queryObject === null || queryObject === void 0 ? void 0 : queryObject.cost);
            }
            if (queryObject === null || queryObject === void 0 ? void 0 : queryObject.amount) {
                query.where('amount').equals(queryObject === null || queryObject === void 0 ? void 0 : queryObject.amount);
            }
            if (queryObject === null || queryObject === void 0 ? void 0 : queryObject._id) {
                query.where('_id').equals(queryObject === null || queryObject === void 0 ? void 0 : queryObject._id);
            }
            yield query
                .exec()
                .then((result) => {
                res.render('front.items.ejs', {
                    title: 'Items',
                    name: result[0].name,
                    cost: result[0].cost,
                    amount: result[0].amount,
                    _id: result[0]._id,
                });
            })
                .catch((error) => {
                throw error;
            });
        });
    }
};
DatabaseController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __metadata("design:paramtypes", [Object])
], DatabaseController);
exports.DatabaseController = DatabaseController;
//# sourceMappingURL=database.controller.js.map