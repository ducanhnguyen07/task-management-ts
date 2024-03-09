import { Request, Response } from "express";
import { paginationHelper } from "../../../helpers/pagination";

import Task from "../models/task.model";

export const index = async (req: Request, res: Response) => {
  // find
  interface Find {
    deleted: boolean;
    status?: string;
  }

  const find: Find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status.toString();
  }
  // end find

  // Pagination
  const countTasks = await Task.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitedItem: 2,
    },
    req.query,
    countTasks
  );
  // End pagination

  // sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  }
  // console.log(sort)
  // end sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitedItem)
    .skip(objectPagination.skip);

  res.json({
    total: countTasks,
    tasks: tasks
  });
};

export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  });

  res.json(task);
};
