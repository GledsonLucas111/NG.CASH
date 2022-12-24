import { UserDataBase } from "../data/UserDataBase";
import { CustomError } from "../error/CustomError";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import {
  filterDTO,
  transactionDTO,
  userDTO,
  userTransaction,
} from "../types/user";

export class UserBusiness {
  constructor(
    private userDataBase: UserDataBase,
    private hashManager: HashManager,
    private authenticator: Authenticator,
    private idGenerator: IdGenerator
  ) {}
  signup = async (input: userDTO) => {
    const { userName, password } = input;
    const hasUpper = (password: string) => /[A-Z]/.test(password);
    const hasLower = (password: string) => /[a-z]/.test(password);

    if (!userName || !password) {
      throw new CustomError(
        422,
        "Preencha os campos: 'useName' e 'password' no body."
      );
    }
    if (userName.length < 3) {
      throw new CustomError(
        422,
        "'UserName' precisa de no mínimo 3 caracteres"
      );
    }

    if (password.length < 8 || !hasUpper(password) || !hasLower(password)) {
      throw new CustomError(
        422,
        "'Password' precisa de no mínimo 8 caracteres, uma letra maiúscula e uma minúscula."
      );
    }

    const id = this.idGenerator.generateId();

    const hashPassword = await this.hashManager.hash(password);

    const user: User = new User(id, userName, hashPassword);

    await this.userDataBase.insert(user);
  };

  login = async (input: userDTO) => {
    const { userName, password } = input;

    if (!userName || !password) {
      throw new CustomError(
        422,
        "Preencha os campos: 'useName' e 'password' no body."
      );
    }

    const findUserByUserName = await this.userDataBase.findByUserName(userName);

    if (!findUserByUserName) {
      throw new CustomError(400, "Usuário ainda não está cadastrado.");
    }

    const hashCompare: boolean = await this.hashManager.compare(
      password,
      findUserByUserName.password
    );

    if (!hashCompare) {
      throw new CustomError(409, "Senha incorreta.");
    }

    const tokenLogin = this.authenticator.generateToken({
      id: findUserByUserName.id,
    });
    return tokenLogin;
  };

  user = async (token: string) => {
    if (!token) {
      throw new CustomError(422, "Necessita de um token.");
    }

    const decodedToken = this.authenticator.getTokenData(token);

    if (!decodedToken.id) {
      throw new CustomError(400, "Token invalido.");
    }

    const user = await this.userDataBase.findById(decodedToken.id);

    return user;
  };

  transaction = async (input: transactionDTO) => {
    const { userName, token, value } = input;
    if (!userName) {
      throw new CustomError(422, "Necessita de um userName.");
    }
    if (!token) {
      throw new CustomError(422, "Necessita de um token.");
    }
    if (!value) {
      throw new CustomError(422, "Necessita de um value.");
    }

    const decodedToken = this.authenticator.getTokenData(token);

    const debitedAccount: userTransaction = await this.userDataBase.findById(
      decodedToken.id
    );

    const creditedAccount: userTransaction =
      await this.userDataBase.findByUserName(userName);

    if (Number(value) > debitedAccount.account.balance) {
      throw new CustomError(400, "Saldo insuficiente.");
    }
    if (userName === debitedAccount.userName) {
      throw new CustomError(
        400,
        "Não é possível realizar um transferência para você mesmo."
      );
    }

    const transactionInfo: Transaction = new Transaction(
      debitedAccount.account.id,
      creditedAccount.account.id,
      Number(value)
    );

    await this.userDataBase.transaction(
      transactionInfo,
      debitedAccount,
      creditedAccount
    );
  };

  historicTransaction = async (token: string, filter: filterDTO) => {
    if (!token) {
      throw new CustomError(422, "Necessita de token.");
    }

    const decodedToken = this.authenticator.getTokenData(token);

    const userAccount = await this.userDataBase.findById(decodedToken.id);
    
    const result = await this.userDataBase.historicTransaction(
      userAccount.account.id,
      filter
    );

    if (result === undefined) {
      throw new CustomError(404, "Transação não encontrada");
    }

    return result;
  };
}
