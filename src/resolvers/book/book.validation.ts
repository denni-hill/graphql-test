import Joi from "joi";
import { In } from "typeorm";
import { getDefaultDataSource } from "../../datasources";
import { Author, Book } from "../../entities";
import { CreateBookInput } from "./types";

export const updateBookValidationSchema = Joi.object<
  Book,
  true,
  CreateBookInput
>({
  name: Joi.string().min(2).max(512),
  description: Joi.string().min(2).max(4096),
  publishedAt: Joi.date(),
  authors: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .custom((value: number[]) => Array.from(new Set(value)))
    .external(async (value) => {
      if (!Array.isArray(value)) return;

      const loadedAuthors = await getDefaultDataSource()
        .getRepository(Author)
        .find({
          where: {
            id: In(value)
          }
        });

      if (loadedAuthors.length !== value.length) {
        const loadedAuthorsIds = loadedAuthors.map(
          (author) => author.id
        );
        const notFoundIds = value.filter(
          (id) => !loadedAuthorsIds.includes(id)
        );

        throw new Error(
          `Authors ids were not found: (${notFoundIds.join(
            ", "
          )})`
        );
      }

      return loadedAuthors;
    })
}).options({ stripUnknown: true });

export const createBookValidationSchema =
  updateBookValidationSchema.fork(
    ["name", "description", "authors"],
    (schema) => schema.required()
  );
