"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const bodyParser = require("body-parser");
const application_module_1 = require("./application.module");
require("./vendor");
const cross = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,Content-Length,X-Requested-With");
    if ("OPTIONS" === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(application_module_1.ApplicationModule);
        app.use(cross);
        app.use(bodyParser.json({ limit: "100000kb" }));
        yield app.listen(3001);
    });
}
bootstrap().then(() => console.log("Application is listening on port 3001"));

//# sourceMappingURL=server.js.map
