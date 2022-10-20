import { GraphQLResolveInfo } from "graphql";
import {
  parseFieldList,
  parseRelations
} from "../parse-field-list";
import {
  Arg,
  ID,
  Info,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { IsNull, Not, Repository } from "typeorm";
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
    const fields = parseFieldList(info.fieldNodes[0]);
    const relations = parseRelations(fields);

    return await this.repository.find({
      select: fields,
      relations
    });
  }

  @Query(() => Book)
  async book(
    @Arg("id", () => ID) id: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<Book> {
    const fields = parseFieldList(info.fieldNodes[0]);
    const relations = parseRelations(fields);

    const book = await this.repository.findOne({
      select: fields,
      where: { id },
      relations
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
    @Arg("id", () => ID) id: number,
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
    @Arg("id", () => ID) id: number
  ): Promise<Book> {
    const book = await this.repository.findOne({
      where: { id }
    });

    if (book === null) throw new Error("Book not found!");

    return await this.repository.softRemove(book);
  }

  @Mutation(() => Book)
  async restoreBook(
    @Arg("id", () => ID) id: number
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
    @Arg("id", () => ID) id: number
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
