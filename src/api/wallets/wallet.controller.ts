import { honoApp } from "@/core/lib/hono";
import { zValidator } from "@hono/zod-validator";
import { topupWalletSchema, walletColorSchema } from "./wallet.schema";
import { GetDetailWalletCase, TopUpWalletCase } from "./wallet.case";

const controller = honoApp();

controller.get("/", zValidator("query", walletColorSchema), async (c) => {
  const user = c.get("user");
  const query = c.req.valid("query");
  console.log(query);
  const wallet = await GetDetailWalletCase.execute(user, query);

  return c.json(wallet);
});

// controller.post('/init', async (c) => {
//   const user = c.get('user');
//   const wallet = await InitWalletCase.execute(user);
//   return c.json(wallet);
// });

controller.post("/top-up", zValidator("json", topupWalletSchema), async (c) => {
  const payload = c.req.valid("json");
  const user = c.get("user");
  const wallet = await TopUpWalletCase.execute(user, payload);
  return c.json(wallet);
});

export const walletController = controller;
