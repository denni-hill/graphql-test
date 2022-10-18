import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany
} from "typeorm";
import { Author } from "./author.entity";
import { BaseEntity } from "./base.entity";

@ObjectType()
@Entity({ name: "books" })
export class Book extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field({ nullable: true, defaultValue: null })
  @Column({ nullable: true, default: null })
  publishedAt?: Date;

  @Field(() => [Author])
  @JoinTable({
    name: "books__authors",
    joinColumn: {
      name: "bookId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "authorId",
      referencedColumnName: "id"
    }
  })
  @ManyToMany(() => Author, (author) => author.books)
  authors: Author[];
}
