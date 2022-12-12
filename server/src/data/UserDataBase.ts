import { PrismaClient } from "@prisma/client";
import { Account } from "../models/Account";
import { User } from "../models/User";

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
      });
      return user[0];
    } catch (e: any) {
      throw new Error(e.sqlMessage || e.message);
    }
  };
}
