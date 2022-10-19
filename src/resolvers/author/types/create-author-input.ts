import { Field, InputType } from "type-graphql";

@InputType({ description: "New author data" })
export class CreateAuthorInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  bio: string;
}
