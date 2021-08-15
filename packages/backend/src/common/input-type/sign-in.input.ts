import { Field, InputType } from '@nestjs/graphql';
import { IsDefined } from 'class-validator';

@InputType()
export class SignInInput {
  @Field({ nullable: true })
  @IsDefined()
  username: string;

  @Field({ nullable: true })
  @IsDefined()
  password: string;
}
