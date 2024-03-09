interface ObjectPagination {
  currentPage: number;
  limitedItem: number;
  skip?: number;
  totalPage?: number;
}

export const paginationHelper = (
  objectPagination: ObjectPagination,
  query,
  countRecords: number
): ObjectPagination => {
  // page for step
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  if (query.limit) {
    objectPagination.limitedItem = parseInt(query.limit);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitedItem;

  // calculate total pages
  const totalPage = Math.ceil(countRecords / objectPagination.limitedItem);

  objectPagination.totalPage = totalPage;

  return objectPagination;
};
