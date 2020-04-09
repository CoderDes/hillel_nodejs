"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const app = express_1.default();
const port = process.env.PORT || '3000';
app.use(router_1.default);
app.listen(port, () => {
    console.log(`Server started on port: ${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map