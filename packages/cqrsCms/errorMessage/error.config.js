"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
exports.ErrorInterfaceConfig = {
    "create:missingInformation": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "Unable to create a new navigation with missing information.",
        userMessage: "Unable to create a new navigation with missing information.",
    },
    "delete:recycling:idMissing": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The current id corresponding to the data does not exist.",
        userMessage: "The current id corresponding to the data does not exist.",
    },
    "remove:articles:removeSuccess": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "删除数据成功.",
        userMessage: "删除数据成功",
    },
    "remove:articles:removeFailure": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "删除数据失败.",
        userMessage: "删除数据失败",
    },
    "create:publishedTime:lessThan": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The published time cannot be less than the current time.",
        userMessage: "The published time cannot be less than the current time.",
    },
    "create:classify:parentIdMissing": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The upper level classification does not exist.",
        userMessage: "The upper level classification does not exist."
    },
    "create:level:lessThanLevel": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "Cannot select a category smaller than the current classification.",
        userMessage: "Cannot select a category smaller than the current classification."
    },
    "create:classify:aliasRepeat": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "alias cannot be repeated, please re-enter.",
        userMessage: " alias cannot be repeated, please re-enter.",
    },
    "update:classify:updateById": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The id corresponding classification does not exist, please re-enter.",
        userMessage: "The id corresponding classification does not exist, please re-enter.",
    },
    "delete:page:deleteById": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The current id corresponds to the page table does not exist.",
        userMessage: "The current id corresponds to the page table does not exist.",
    },
    "create:page:missingTitle": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The title cannot be empty when the page is created.",
        userMessage: "The title cannot be empty when the page is created.",
    },
    "create:page:missingAlias": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The alias cannot be empty when the page is created.",
        userMessage: "The alias cannot be empty when the page is created.",
    },
    "page:classify:classifyIdMissing": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "The classifyId input does not exist, please re-enter.",
        userMessage: "The classifyId input does not exist, please re-enter.",
    },
    "drop:table:ById1": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "Cannot delete the data of id=1 (root node).",
        userMessage: "Cannot delete the data of id=1 (root node).",
    },
    "delete:art:ClassifyIdIncludeArts": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "There are articles under the current classification and cannot be deleted.",
        userMessage: "There are articles under the current classification and cannot be deleted."
    },
    "delete:page:ClassifyIdIncludePages": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "There are pages under the current classification and cannot be deleted.",
        userMessage: "There are pages under the current classification and cannot be deleted."
    },
    "dataBase:curd:error": {
        type: "BadRequest",
        httpStatus: common_1.HttpStatus.BAD_REQUEST,
        errorMessage: "数据库错误.",
        userMessage: "数据库错误."
    }
};
