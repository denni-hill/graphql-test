import { GraphQLResolveInfo } from "graphql";
import {
  Arg,
  Info,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import {
  FindOptionsSelect,
  IsNull,
  Not,
  Repository
} from "typeorm";
import { getDefaultDataSource } from "../../datasources";
import { Book } from "../../entities";
import {
  createBookValidationSchema,
  updateBookValidationSchema
} from "./book.validation";
import { CreateBookInput } from "./types/create-book-input";
import { UpdateBookInput } from "./types/update-book-input";

@Resolver(() => Book)
export class BookResolver {
  @Query(() => [Book])
  async books(
    @Info() info: GraphQLResolveInfo
  ): Promise<Book[]> {
    return await this.repository.find({
      relations: {
        authors: true
      }
    });
  }

  @Query(() => Book)
  async book(
    @Arg("id", () => Int) id: number
  ): Promise<Book> {
    const book = await this.repository.findOne({
      where: { id }
    });
    if (book === null) throw new Error("Book not found!");
    return book;
  }

  @Mutation(() => Book)
  async createBook(
    @Arg("data") data: CreateBookInput
  ): Promise<Book> {
    const validatedData =
      await createBookValidationSchema.validateAsync(data);

    const newBook = this.repository.create(validatedData);

    return await this.repository.save(newBook);
  }

  @Mutation(() => Book)
  async updateBook(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateBookInput
  ): Promise<Book> {
    const book = await this.repository.findOne({
      where: {
        id
      }
    });

    if (book === null) throw new Error("Book not found!");

    const validatedData =
      await updateBookValidationSchema.validateAsync(data);

    this.repository.merge(book, validatedData);

    return await this.repository.save(book);
  }

  @Mutation(() => Book)
  async softDeleteBook(
    @Arg("id", () => Int) id: number
  ): Promise<Book> {
    const book = await this.repository.findOne({
      where: { id }
    });

    if (book === null) throw new Error("Book not found!");

    return await this.repository.softRemove(book);
  }

  @Mutation(() => Book)
  async restoreBook(
    @Arg("id", () => Int) id: number
  ): Promise<Book> {
    const book = await this.repository.findOne({
      where: {
        id,
        deletedAt: Not(IsNull())
      },
      withDeleted: true
    });

    if (book === null) throw new Error("Book not found!");

    return await this.repository.recover(book);
  }

  @Mutation(() => Boolean)
  async purgeBook(
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    const result = await this.repository.delete({
      id
    });
    if (result.affected === 0)
      throw new Error("Book not found!");

    return true;
  }

  private get repository(): Repository<Book> {
    return getDefaultDataSource().getRepository(Book);
  }
}
