export class Account {
  constructor(private id: string, private balance: number) {}

  getId = (): string => {
    return this.id;
  };
  getBalance = (): number => {
    return this.balance;
  };
}
