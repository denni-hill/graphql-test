import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Book } from "./book.entity";

@ObjectType()
@Entity({ name: "authors" })
export class Author extends BaseEntity {
  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  bio: string;

  @Field(() => [Book])
  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];
}
