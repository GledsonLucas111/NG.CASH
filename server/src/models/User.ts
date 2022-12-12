export class User {
  constructor(
    private id: string,
    private userName: string,
    private password: string,
  ) {}

  getId = (): string => {
    return this.id;
  };

  getUserName = (): string => {
    return this.userName;
  };

  getPassword = (): string => {
    return this.password;
  };

}
