import { ErrorHandler } from "hono/types";
import { pinoLogger } from "./logger";

export const errorHandler: ErrorHandler = (error, context) => {
  console.log(error);

  pinoLogger.error(
    { error: error.message, stack: error.stack, name: error.name },
    "Unhandled Error"
  );

  return context.json(null);
};
