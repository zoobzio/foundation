import { z } from "zod";
import {
  createError,
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from "#imports";
import { commissionUpdateSchema } from "#shared/commissions";
import { updateCommission } from "~~/server/utils/commissions";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
  const patch = await readValidatedBody(event, commissionUpdateSchema.parse);

  const commission = updateCommission(id, patch);
  if (!commission) {
    throw createError({
      statusCode: 404,
      statusMessage: `Commission ${id} not found`,
    });
  }

  return commission;
});
