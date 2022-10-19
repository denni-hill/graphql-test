import { NonEmptyArray } from "type-graphql";
import { AuthorResolver } from "./author";
import { BookResolver } from "./book";

export * from "./book/";

const resolvers: NonEmptyArray<Function> = [
  BookResolver,
  AuthorResolver
];

export default resolvers;
