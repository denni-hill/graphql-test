import { Field, ID, ObjectType } from "type-graphql";
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn
} from "typeorm";

@ObjectType()
export abstract class BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;
}
