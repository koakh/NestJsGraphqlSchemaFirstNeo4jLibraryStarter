import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserPasswordInput {
  @Field()
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsDefined()
  password: string;
}
