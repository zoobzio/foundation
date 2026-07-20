import {
  defineEventHandler,
  readValidatedBody,
  setResponseStatus,
} from "#imports";
import { commissionCreateSchema } from "#shared/commissions";
import { createCommission } from "../../utils/commissions";

export default defineEventHandler(async (event) => {
  const input = await readValidatedBody(event, commissionCreateSchema.parse);
  const commission = createCommission(input);
  setResponseStatus(event, 201);
  return commission;
});
