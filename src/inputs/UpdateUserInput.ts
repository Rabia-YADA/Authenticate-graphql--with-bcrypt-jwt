import { InputType, Field } from "type-graphql";
import { BaseEntity } from "typeorm";

@InputType()
export class UserUpdateInput extends BaseEntity {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: number;
}
