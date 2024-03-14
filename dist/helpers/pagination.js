"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
const paginationHelper = (objectPagination, query, countRecords) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        objectPagination.limitedItem = parseInt(query.limit);
    }
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitedItem;
    const totalPage = Math.ceil(countRecords / objectPagination.limitedItem);
    objectPagination.totalPage = totalPage;
    return objectPagination;
};
exports.paginationHelper = paginationHelper;
