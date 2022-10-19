import { Field, InputType } from "type-graphql";

@InputType({ description: "New book data" })
export class CreateBookInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field({ nullable: true })
  publishedAt?: Date;
  @Field(() => [Number], {
    nullable: true,
    defaultValue: undefined
  })
  authors: number[];
}
