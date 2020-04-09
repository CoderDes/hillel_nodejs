"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', (err, req, res, next) => {
    res.send('Yo');
});
exports.default = router;
//# sourceMappingURL=router.js.map