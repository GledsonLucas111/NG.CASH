import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { CustomError } from "../error/CustomError";
import { filterDTO, transactionDTO, userDTO } from "../types/user";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}
  signup = async (req: Request, res: Response) => {
    try {
      const input: userDTO = {
        userName: req.body.userName,
        password: req.body.password,
      };
      await this.userBusiness.signup(input);

      res.status(201).send({ message: "Usuário cadastrado com sucesso!" });
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
        userName: req.body.userName,
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
  user = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const id = req.params.id;

      const result = await this.userBusiness.user(token);

      res.status(200).send(result);
    } catch (e) {
      if (e instanceof CustomError) {
        res.status(e.statusCode).send(e.message);
      } else if (e instanceof Error) {
        res.status(400).send(e.message);
      }
    }
  };
  transaction = async (req: Request, res: Response) => {
    try {
      const input: transactionDTO = {
        token: req.headers.authorization,
        userName: req.body.userName,
        value: req.body.value,
      };

      await this.userBusiness.transaction(input);

      res.status(200).send({ message: "Transferência realizada com sucesso!" });
    } catch (e) {
      if (e instanceof CustomError) {
        res.status(e.statusCode).send(e.message);
      } else if (e instanceof Error) {
        res.status(400).send(e.message);
      }
    }
  };
  historicTransaction = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const filter: filterDTO = {
        date: req.body.date as string,
        transact: req.query.transact as string,
      }

      const result = await this.userBusiness.historicTransaction(token, filter);
      
      res.status(200).send(result);
    } catch (e) {
      if (e instanceof CustomError) {
        res.status(e.statusCode).send(e.message);
      } else if (e instanceof Error) {
        res.status(400).send(e.message);
      }
    }
  };
}
