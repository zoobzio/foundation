import { z } from "zod";
import {
  createError,
  defineEventHandler,
  getValidatedRouterParams,
  setResponseStatus,
} from "#imports";
import { deleteCommission } from "../../utils/commissions";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const deleted = deleteCommission(id);
  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: `Commission ${id} not found`,
    });
  }

  setResponseStatus(event, 204);
  return null;
});
