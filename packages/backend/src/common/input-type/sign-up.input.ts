import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SignUpInput {
  @Field({ nullable: true })
  @IsDefined()
  username: string;

  @Field({ nullable: true })
  @IsDefined()
  password: string;

  @Field({ nullable: true })
  @IsDefined()
  @IsOptional()
  firstName: string;

  @Field({ nullable: true })
  @IsDefined()
  @IsOptional()
  lastName: string;

  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field(type => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  metaData: any;
}
