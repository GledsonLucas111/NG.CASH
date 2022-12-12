import dotenv from "dotenv";
import { AddressInfo } from "net";
import express, { Express } from "express";
import cors from "cors";
import { userRouter } from "./router/useRouter";

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

const server = app.listen(process.env.PORT || 3004, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
