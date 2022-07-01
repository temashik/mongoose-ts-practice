"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Items = void 0;
class Items {
    constructor(_name, _cost, _amount, _user, __id) {
        this._name = _name;
        this._cost = _cost;
        this._amount = _amount;
        this._user = _user;
        this.__id = __id;
    }
    get name() {
        return this._name;
    }
    get cost() {
        return this._cost;
    }
    get amount() {
        return this._amount;
    }
    get user() {
        return this._user;
    }
    get _id() {
        return this.__id;
    }
}
exports.Items = Items;
//# sourceMappingURL=item.entity.js.map