import { UserDataBase } from "../data/UserDataBase";
import { CustomError } from "../error/CustomError";
import { User } from "../models/User";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { userDTO } from "../types/user";

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

    const accessToken = this.authenticator.generateToken({ id });

    return accessToken;
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
}
