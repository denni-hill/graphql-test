import { Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { getDefaultDataSource } from "../datasources";
import { Book } from "../entities";

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  books() {
    return this.booksRepository.find();
  }

  get booksRepository(): Repository<Book> {
    return getDefaultDataSource().getRepository(Book);
  }
}
