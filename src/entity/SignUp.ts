import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"
import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class SignUp  extends BaseEntity{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => String)
    @Column()
    name: string

    @Field( () => String)
    @Column()
    lastname: string

    @Field(() => String)
    @Column()
    email: string

    @Field(() => String)
    @Column()
    password: string

}


