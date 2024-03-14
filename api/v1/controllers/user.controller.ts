import { Request, Response } from "express";
import md5 from 'md5';
import { generateRandomString } from "../../../helpers/generate";

import User from '../models/user.model';

// [POST] /api/v1/user/register
export const register = async (req: Request, res: Response) => {
  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    res.json({
      code: 400,
      message: "Email existed"
    });
  } else {
    const newUser = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      token: generateRandomString(30)
    };

    const user = new User(newUser);
    const data = await user.save();

    const token = data.token;

    res.json({
      code: 200,
      message: "Successfully",
      token: token
    });
  }
};