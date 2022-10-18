import { NonEmptyArray } from "type-graphql";
import { BookResolver } from "./book.resolver";

export * from "./book.resolver";

const resolver: NonEmptyArray<Function> = [BookResolver];

export default resolver;
