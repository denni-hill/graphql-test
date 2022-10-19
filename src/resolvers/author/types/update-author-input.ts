import { Field, InputType } from "type-graphql";

@InputType({ description: "Update author data" })
export class UpdateAuthorInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  bio?: string;
}
