import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { CustomError } from "../error/CustomError";
import { userDTO } from "../types/user";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}
  signup = async (req: Request, res: Response) => {
    try {
      const input: userDTO = {
        userName: req.body.username,
        password: req.body.password,
      };
      const result = await this.userBusiness.signup(input);

      res.status(201).send({ token: result });
    } catch (e) {
      if (e instanceof CustomError) {
        res.status(e.statusCode).send(e.message);
      } else if (e instanceof Error) {
        res.status(400).send(e.message);
      }
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      const input: userDTO = {
        userName: req.body.username,
        password: req.body.password,
      };

      const result = await this.userBusiness.login(input);

      res.status(201).send({ token: result });
    } catch (e) {
      if (e instanceof CustomError) {
        res.status(e.statusCode).send(e.message);
      } else if (e instanceof Error) {
        res.status(400).send(e.message);
      }
    }
  };
}
