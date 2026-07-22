import { z } from "zod";
import {
  createError,
  defineEventHandler,
  getValidatedRouterParams,
} from "#imports";
import { getCommission } from "~~/server/utils/commissions";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const commission = getCommission(id);
  if (!commission) {
    throw createError({
      statusCode: 404,
      statusMessage: `Commission ${id} not found`,
    });
  }

  return commission;
});
