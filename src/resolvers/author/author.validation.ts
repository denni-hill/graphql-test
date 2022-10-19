import Joi from "joi";
import { Author } from "../../entities";
import { UpdateAuthorInput } from "./types";

export const updateAuthorValidationSchema = Joi.object<
  Author,
  true,
  UpdateAuthorInput
>({
  firstName: Joi.string().min(2).max(128),
  lastName: Joi.string().min(2).max(256),
  bio: Joi.string().min(2).max(32768)
}).options({ stripUnknown: true });

export const createAuthorValidationSchema =
  updateAuthorValidationSchema.fork(
    ["firstName", "lastName"],
    (schema) => schema.required()
  );
