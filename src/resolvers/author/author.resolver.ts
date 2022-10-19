import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { IsNull, Not, Repository } from "typeorm";
import { getDefaultDataSource } from "../../datasources";
import { Author } from "../../entities";
import {
  createAuthorValidationSchema,
  updateAuthorValidationSchema
} from "./author.validation";
import {
  CreateAuthorInput,
  UpdateAuthorInput
} from "./types";

@Resolver(() => Author)
export class AuthorResolver {
  @Query(() => [Author])
  async authors(): Promise<Author[]> {
    return await this.repository.find();
  }

  @Query(() => Author)
  async author(
    @Arg("id", () => Int) id: number
  ): Promise<Author> {
    const author = await this.repository.findOne({
      where: { id }
    });

    if (author === null)
      throw new Error("Author not found!");

    return author;
  }

  @Mutation(() => Author)
  async createAuthor(
    @Arg("data") data: CreateAuthorInput
  ): Promise<Author> {
    const validatedData =
      await createAuthorValidationSchema.validateAsync(
        data
      );

    const newAuthor = this.repository.create(validatedData);

    return await this.repository.save(newAuthor);
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateAuthorInput
  ): Promise<Author> {
    const author = await this.repository.findOne({
      where: { id }
    });
    if (author === null)
      throw new Error("Author not found!");

    const validatedData =
      await updateAuthorValidationSchema.validateAsync(
        data
      );

    this.repository.merge(author, validatedData);

    return await this.repository.save(author);
  }

  @Mutation(() => Author)
  async softDeleteAuthor(
    @Arg("id", () => Int) id: number
  ): Promise<Author> {
    const author = await this.repository.findOne({
      where: { id }
    });

    if (author === null)
      throw new Error("Author not found!");

    return await this.repository.softRemove(author);
  }

  @Mutation(() => Author)
  async restoreAuthor(
    @Arg("id", () => Int) id: number
  ): Promise<Author> {
    const author = await this.repository.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true
    });

    if (author === null)
      throw new Error("Author not found!");

    return await this.repository.recover(author);
  }

  @Mutation(() => Boolean)
  async purgeAuthor(
    @Arg("id", () => Int) id: number
  ): Promise<boolean> {
    const result = await this.repository.delete({ id });

    if (result.affected === 0)
      throw new Error("Author not found!");

    return true;
  }

  private get repository(): Repository<Author> {
    return getDefaultDataSource().getRepository(Author);
  }
}
