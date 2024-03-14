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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const pagination_1 = require("../../../helpers/pagination");
const search_1 = require("../../../helpers/search");
const task_model_1 = __importDefault(require("../models/task.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const objectSearch = (0, search_1.searchHelper)(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    const countTasks = yield task_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.paginationHelper)({
        currentPage: 1,
        limitedItem: 2,
    }, req.query, countTasks);
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitedItem)
        .skip(objectPagination.skip);
    res.json({
        total: countTasks,
        tasks: tasks
    });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield task_model_1.default.findOne({
        _id: id,
        deleted: false,
    });
    res.json(task);
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const StatusType = ["initial", "doing", "finish", "pending", "notFinish"];
    const id = req.params.id;
    const status = req.body.status;
    if (StatusType.includes(status)) {
        try {
            yield task_model_1.default.updateOne({ _id: id }, { status: status });
            res.json({
                code: "200",
                message: "Successfully!"
            });
        }
        catch (error) {
            res.json({
                code: "400",
                message: "Failed to update!"
            });
        }
    }
    else {
        res.json({
            code: "400",
            message: "Failed to update!"
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case Key.STATUS:
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                break;
            case Key.DELETE:
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                break;
            default:
                res.json({
                    code: "400",
                    message: "Not exist!"
                });
                break;
        }
        res.json({
            code: "200",
            message: "Successfully!"
        });
    }
    catch (error) {
        res.json({
            code: "400",
            message: "Failed!"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res.json({
            code: 200,
            message: "Successfully!",
            data: data
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Failed!"
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            message: "Successfully!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Failed!"
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "Successfully!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Falied!"
        });
    }
});
exports.deleteTask = deleteTask;
