import { honoApp } from "@/core/lib/hono";
import {
  RecentTransactionCase,
  RecordTransactionCase,
  TransactionListCase,
} from "./transaction.case";
import { TransactionDetail } from "./transaction.dto";
import { zValidator } from "@hono/zod-validator";
import {
  transactionFilterSchema,
  transactionInsertSchema,
} from "./transaction.schema";

const controller = honoApp();

controller.get("/", zValidator("query", transactionFilterSchema), async (c) => {
  const user = c.get("user");
  const filter = c.req.valid("query");
  const transactions = await TransactionListCase.execute(user, filter);
  return c.json(
    transactions.map((transaction) => new TransactionDetail(transaction))
  );
});

controller.post("/", zValidator("json", transactionInsertSchema), async (c) => {
  const user = c.get("user");
  const payload = c.req.valid("json");
  const transaction = await RecordTransactionCase.execute(user, payload);
  console.log(transaction);
  return c.json(transaction);
});

controller.get("/recents", async (c) => {
  const user = c.get("user");
  const transactions = await RecentTransactionCase.execute(user);
  return c.json(
    transactions.map((transaction) => new TransactionDetail(transaction))
  );
});

export const transactionController = controller;
