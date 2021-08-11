import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

// this serves has the master for user.model and convector user.model in citizen card properties

@InputType()
export class NewUserInput {
  // optional: generated automatically, but can optionally be used
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  id: string;

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
