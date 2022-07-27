import { InputType, Field } from "type-graphql";
import { BaseEntity } from "typeorm";

@InputType()
export class UserCreateInput extends BaseEntity {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
