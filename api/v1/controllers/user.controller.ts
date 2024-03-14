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

// [POST] /api/v1/user/login
export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    res.json({
      code: 400,
      message: "Email not existed!"
    });
    return;
  }

  if(md5(password) !== user.password) {
    res.json({
      code: 400,
      message: "Wrong password!"
    });
    return;
  }

  const token = user.token;

  res.json({
    code: 200,
    message: "Successfully!",
    token: token
  });
};