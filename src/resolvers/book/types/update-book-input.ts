import { Field, InputType } from "type-graphql";

@InputType({ description: "Update book data" })
export class UpdateBookInput {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  publishedAt?: Date;
  @Field(() => [Number], {
    nullable: true,
    defaultValue: undefined
  })
  authors?: number[];
}
