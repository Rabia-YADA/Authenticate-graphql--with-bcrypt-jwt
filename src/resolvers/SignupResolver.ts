import { Resolver, Query, Mutation, Arg, ObjectType, Field, FieldResolver, Root, UseMiddleware, Ctx} from "type-graphql";
import { BaseEntity } from "typeorm";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { SignUp } from "../entity/SignUp";
import { MyContext } from "../MyContext";
import { isAuth } from "../isAuth";


@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver(SignUp)
export class SignUpResolver extends BaseEntity {
    @Query( ()=> String)
    async hello() {
        return "hello world"
    }

    //We are making a ‘Me’ query which need jwt token to authenticate and tell which user currently is login.
    @Query(() => String)
    @UseMiddleware(isAuth)
    async Me(@Ctx() { payload }: MyContext) {
      return `Your user id : ${payload!.id}`;
    }

    @FieldResolver( of=> ObjectType)
    protected async name( @Root() parent: SignUp) {
        return `${parent.name} ${parent.lastname}`;
    }

    @Query(() => [SignUp])
    async getSignUp() {
      return await SignUp.find();
    }
//Mutation of register
    @Mutation( () => Boolean)
    async Signup( 
        @Arg("name") name: string, 
        @Arg("lastname") lastname: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 13);
        try {
            const signup= await SignUp.create({
              name,
              lastname,
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
        const signup = await SignUp.findOne({ where: { email } });
        if (!signup) {
        throw new Error("no user registration");
    }

    const verify = compare(password, signup.password);

    if (!verify) {
      throw new Error("Bad password");
    }

    return {
      accessToken: sign({ userId: signup.id }, "MySecretKey", {
        expiresIn: "15m"
      })
    };
  }

  //delete signup by id
  @Mutation(() => Boolean)
  async deleteSign(@Arg("id") id: number) {
    const signup = await SignUp.findOne({ where: { id } });
    if (!signup) {
      throw new Error("kullanıcı bulunamdı");
    }
    await signup.remove();
    return true;
  }
}