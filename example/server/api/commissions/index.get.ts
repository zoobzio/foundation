import { defineEventHandler, getValidatedQuery } from "#imports";
import { commissionListQuerySchema } from "#shared/commissions";
import { listCommissions } from "~~/server/utils/commissions";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(
    event,
    commissionListQuerySchema.parse,
  );
  return listCommissions(query);
});
