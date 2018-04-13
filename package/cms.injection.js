"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const injection_1 = require("@notadd/injection");
const cqrs_module_1 = require("./cqrsCms/cqrs.module");
const registration_module_1 = require("./enter/registration.module");
const addon_upyun_1 = require("@notadd/addon-upyun");
let CmsModule = class CmsModule {
};
CmsModule = __decorate([
    injection_1.Module({
        authors: [
            {
                email: "admin@notadd.com",
                username: "notadd",
            },
            {
                email: "1945320167@qq.com",
                username: "EricAll",
            },
        ],
        identification: "module-cms",
        name: "Module CMS",
        version: "2.0.3",
        imports: [
            cqrs_module_1.CqrsModule,
            addon_upyun_1.UpyunModule,
            registration_module_1.RegistrationModule,
        ],
    })
], CmsModule);
exports.CmsModule = CmsModule;
