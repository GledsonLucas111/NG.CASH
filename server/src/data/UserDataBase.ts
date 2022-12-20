import { PrismaClient } from "@prisma/client";
import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { userTransaction } from "../types/user";

const prisma = new PrismaClient();

export class UserDataBase extends PrismaClient {
  public insert = async (userInfo: User) => {
    try {
      const accountUser = await prisma.accounts.create({
        data: {},
      });

      await prisma.user.create({
        data: {
          id: userInfo.getId(),
          userName: userInfo.getUserName(),
          password: userInfo.getPassword(),
          accountId: accountUser.id,
        },
      });
    } catch (e: any) {
      throw new Error(e.sqlMessage || e.message);
    }
  };

  public findByUserName = async (userName: string) => {
    try {
      const user = await prisma.user.findMany({
        where: {
          userName,
        },
        select: {
          id: true,
          userName: true,
          password: true,
          account: {
            select: {
              id: true,
              balance: true,
            },
          },
        },
      });
      return user[0];
    } catch (e: any) {
      throw new Error(e.sqlMessage || e.message);
    }
  };

  public findById = async (id: string) => {
    try {
      const user = await prisma.user.findMany({
        where: {
          id,
        },
        select: {
          id: true,
          userName: true,
          account: {
            select: {
              id: true,
              balance: true,
            },
          },
        },
      });
      return user[0];
    } catch (e: any) {
      throw new Error(e.sqlMessage || e.message);
    }
  };

  public transaction = async (
    transactionInfo: Transaction,
    debitedAccount: userTransaction,
    creditedAccount: userTransaction
  ) => {
    try {
      const transact = await prisma.transactions.create({
        data: {
          debitedAccountId: transactionInfo.getDebitedId(),
          creditedAccountId: transactionInfo.getCreditedId(),
          value: transactionInfo.getValue(),
        },
      });

      await prisma.accounts.update({
        where: {
          id: debitedAccount.account.id,
        },
        data: {
          balance: debitedAccount.account.balance - transact.value,
        },
      });

      await prisma.accounts.update({
        where: {
          id: creditedAccount.account.id,
        },
        data: {
          balance: creditedAccount.account.balance + transact.value,
        },
      });
    } catch (e: any) {
      throw new Error(e.sqlMessage || e.message);
    }
  };
}
