
import { Resolver, Query, Mutation, Arg, ObjectType, Field, FieldResolver, Root, UseMiddleware, Ctx} from "type-graphql";
import { BaseEntity } from "typeorm";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../entity/User";
import { MyContext } from "../MyContext";
import { UserCreateInput } from "../inputs/CreateUserInput";
import { UserUpdateInput } from "../inputs/UpdateUserInput";
import { isAuth } from "../isAuth";


@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}
@Resolver(User)
export class UserResolver extends BaseEntity {
  //find user by id
  @Query(() => [User])
  async getUser() {
    return await User.find();
  }
 
  //We are making a ‘Me’ query which need jwt token to authenticate and tell which user currently is login.
  @Query(() => String)
  @UseMiddleware(isAuth)
  async Me(@Ctx() { payload }: MyContext) {
    return `Your user id : ${payload!.id}`;
  }

  @FieldResolver( of=> ObjectType)
  protected async name( @Root() parent: User) {
      return `${parent.name}`;
  }
//Mutation of register
  @Mutation( () => Boolean)
  async Register( 
      @Arg("name") name: string, 
      @Arg("email") email: string,
      @Arg("password") password: string
  ) {
      const hashedPassword = await hash(password, 13);
      try {
          const user= await User.create({
            name,
            email,
            password: hashedPassword
          }).save();
        } catch (err) {
          console.log(err);
          return false;
        }
     return true;

  }

  //Mutation of login
  @Mutation( () => LoginResponse)
  async Login( @Arg("email") email: string, @Arg("password") password: string) {
      const user = await User.findOne({ where: { email } });
      if (!user) {
      throw new Error("no user registration");
  }

  const verify = compare(password, user.password);

  if (!verify) {
    throw new Error("Bad password");
  }

  return {
    accessToken: sign({ userId: user.id }, "MySecretKey", {
      expiresIn: "15m"
    })
  };
}
 
 
 
 
 
 
 
 
 
 
 
 

}
