"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const users_statics_1 = require("./users.statics");
const users_methods_1 = require("./users.methods");
const UserSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdate: {
        type: Date,
        default: new Date(),
    },
});
UserSchema.statics.findOneOrCreate = users_statics_1.findOneOrCreate;
UserSchema.statics.findByAge = users_statics_1.findByAge;
UserSchema.methods.setLastUpdated = users_methods_1.setLastUpdated;
UserSchema.methods.sameLastName = users_methods_1.sameLastName;
exports.default = UserSchema;
//# sourceMappingURL=users.schema.js.map