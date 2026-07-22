import { defineEventHandler, getValidatedQuery } from "#imports";
import { commissionFiltersSchema } from "#shared/commissions";
import { listCommissions } from "~~/server/utils/commissions";

export default defineEventHandler(async (event) => {
  const filters = await getValidatedQuery(event, commissionFiltersSchema.parse);
  return listCommissions(filters);
});
