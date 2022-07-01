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
exports.ItemsService = void 0;
const item_entity_1 = require("./item.entity");
const db_model_1 = __importDefault(require("./db_config/db.model"));
const inversify_1 = require("inversify");
let ItemsService = class ItemsService {
    createItems({ name, cost, amount }, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = new item_entity_1.Items(name, cost, amount, user);
            const findResult = yield db_model_1.default.findOne({ name: newItem.name });
            if (findResult) {
                return null;
            }
            const result = yield db_model_1.default.create({
                name: newItem.name,
                cost: newItem.cost,
                amount: newItem.amount,
                user: newItem.user,
            });
            return new item_entity_1.Items(result.name, result.cost, result.amount, result.user, result._id);
        });
    }
    findItems({ name, cost, amount }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = new item_entity_1.Items(name, cost, amount);
            const query = db_model_1.default.find();
            if (newItem === null || newItem === void 0 ? void 0 : newItem.name) {
                query.where('name').equals(newItem === null || newItem === void 0 ? void 0 : newItem.name);
            }
            if (newItem === null || newItem === void 0 ? void 0 : newItem.cost) {
                query.where('cost').equals(newItem === null || newItem === void 0 ? void 0 : newItem.cost);
            }
            if (newItem === null || newItem === void 0 ? void 0 : newItem.amount) {
                query.where('amount').equals(newItem === null || newItem === void 0 ? void 0 : newItem.amount);
            }
            const result = yield query.exec();
            let items;
            if (result.length == 0) {
                return null;
            }
            else {
                items = result.map((item) => {
                    return new item_entity_1.Items(item.name, item.cost, item.amount, item.user, item._id);
                });
                return items;
            }
        });
    }
    updateItems({ name, cost, amount, newName, newCost, newAmount }, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = new item_entity_1.Items(name, cost, amount);
            const validRoot = db_model_1.default.findOne();
            if (newItem === null || newItem === void 0 ? void 0 : newItem.name) {
                validRoot.where('name').equals(newItem === null || newItem === void 0 ? void 0 : newItem.name);
            }
            if (newItem === null || newItem === void 0 ? void 0 : newItem.cost) {
                validRoot.where('cost').equals(newItem === null || newItem === void 0 ? void 0 : newItem.cost);
            }
            if (newItem === null || newItem === void 0 ? void 0 : newItem.amount) {
                validRoot.where('amount').equals(newItem === null || newItem === void 0 ? void 0 : newItem.amount);
            }
            const verify = yield validRoot.exec();
            if (!verify || verify.user != user) {
                return null;
            }
            const oldValue = new item_entity_1.Items(name, cost, amount);
            const newValue = new item_entity_1.Items(newName, newCost, newAmount);
            const query = db_model_1.default.where();
            if (oldValue === null || oldValue === void 0 ? void 0 : oldValue.name) {
                query.where('name').equals(oldValue === null || oldValue === void 0 ? void 0 : oldValue.name);
            }
            if (oldValue === null || oldValue === void 0 ? void 0 : oldValue.cost) {
                query.where('cost').equals(oldValue === null || oldValue === void 0 ? void 0 : oldValue.cost);
            }
            if (oldValue === null || oldValue === void 0 ? void 0 : oldValue.amount) {
                query.where('amount').equals(oldValue === null || oldValue === void 0 ? void 0 : oldValue.amount);
            }
            if (newValue === null || newValue === void 0 ? void 0 : newValue.name) {
                query.updateMany({ name: newValue === null || newValue === void 0 ? void 0 : newValue.name });
            }
            if (newValue === null || newValue === void 0 ? void 0 : newValue.amount) {
                query.updateMany({ amount: newValue === null || newValue === void 0 ? void 0 : newValue.amount });
            }
            if (newValue === null || newValue === void 0 ? void 0 : newValue.cost) {
                query.updateMany({ cost: newValue === null || newValue === void 0 ? void 0 : newValue.cost });
            }
            const result = yield query.exec();
            if (result.modifiedCount == 0) {
                return null;
            }
            else {
                const data = {
                    name: newValue.name,
                    cost: newValue.cost,
                    amount: newValue.amount,
                };
                const res = yield this.findItems(data);
                return res;
            }
        });
    }
    deleteItem({ name, cost, amount, _id }, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const validItem = new item_entity_1.Items(name, cost, amount, undefined, _id);
            const validRoot = db_model_1.default.findOne();
            if (validItem === null || validItem === void 0 ? void 0 : validItem.name) {
                validRoot.where('name').equals(validItem === null || validItem === void 0 ? void 0 : validItem.name);
            }
            if (validItem === null || validItem === void 0 ? void 0 : validItem.cost) {
                validRoot.where('cost').equals(validItem === null || validItem === void 0 ? void 0 : validItem.cost);
            }
            if (validItem === null || validItem === void 0 ? void 0 : validItem.amount) {
                validRoot.where('amount').equals(validItem === null || validItem === void 0 ? void 0 : validItem.amount);
            }
            if (validItem === null || validItem === void 0 ? void 0 : validItem._id) {
                validRoot.where('_id').equals(validItem === null || validItem === void 0 ? void 0 : validItem._id);
            }
            const verify = yield validRoot.exec();
            if (!verify || verify.user != user) {
                return false;
            }
            const newItem = new item_entity_1.Items(name, cost, amount, undefined, _id);
            const query = db_model_1.default.where();
            if (newItem === null || newItem === void 0 ? void 0 : newItem.name) {
                query.where('name').equals(newItem === null || newItem === void 0 ? void 0 : newItem.name);
            }
            if (newItem === null || newItem === void 0 ? void 0 : newItem.cost) {
                query.where('cost').equals(newItem === null || newItem === void 0 ? void 0 : newItem.cost);
            }
            if (newItem === null || newItem === void 0 ? void 0 : newItem.amount) {
                query.where('amount').equals(newItem === null || newItem === void 0 ? void 0 : newItem.amount);
            }
            if (newItem === null || newItem === void 0 ? void 0 : newItem._id) {
                query.where('_id').equals(newItem === null || newItem === void 0 ? void 0 : newItem._id);
            }
            const result = yield query.deleteOne().exec();
            if (result.deletedCount == 0) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    getItem({ name, cost, amount, _id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = db_model_1.default.findOne();
            if (name) {
                query.where('name').equals(name);
            }
            if (cost) {
                query.where('cost').equals(cost);
            }
            if (amount) {
                query.where('amount').equals(amount);
            }
            if (_id) {
                query.where('_id').equals(_id);
            }
            const item = yield query.exec();
            if (!item) {
                return new item_entity_1.Items();
            }
            return new item_entity_1.Items(item.name, item.cost, item.amount, item.user, item._id);
        });
    }
};
ItemsService = __decorate([
    (0, inversify_1.injectable)()
], ItemsService);
exports.ItemsService = ItemsService;
//# sourceMappingURL=items.service.js.map