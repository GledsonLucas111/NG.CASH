export class Transaction {
  constructor(
      private debitedId: string,
      private creditedId: string,
      private value: number,
      ) {}

  getDebitedId = (): string => {
    return this.debitedId;
  };

  getCreditedId = (): string => {
    return this.creditedId;
  };

  getValue = (): number => {
    return this.value;
  };
}
