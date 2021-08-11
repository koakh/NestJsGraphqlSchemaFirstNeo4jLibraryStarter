import { AuthUser, CurrentUserPayload, User, UserRoles, UserServiceAbstract } from "@koakh/nestjs-package-jwt-authentication-graphql";
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationArgs } from '../common/arg-types';
import { newUuid } from '../common/utils/main.util';
import { DeleteUserInput, NewUserInput, UpdateUserInput, UpdateUserPasswordInput, UpdateUserProfileInput } from './input-type';
import { UserData } from './interfaces';
import { constants as c } from "./user.constants";
import { UserInMemory } from './user.data';
import { UserStore } from './user.store';
import { hashPassword } from './utils';

@Injectable()
export class UserService implements UserServiceAbstract {
  // init usersStore inMemory refreshToken versions
  usersStore: UserStore = new UserStore();
  // init usersStore
  usersData: UserInMemory = new UserInMemory();

  validateFreeUserEmail = (username: string, email: string) => {
    const findUser = this.usersData.find((e: UserData) => e.username === username || e.email === email, c.adminCurrentUser);
    if (findUser) {
      throw new HttpException({ status: HttpStatus.CONFLICT, error: 'user with that username and/or email already exists!' }, HttpStatus.CONFLICT);
    }
  }

  validateEmail = (userId: string, email: string) => {
    const findUser = this.usersData.find((e: UserData) => e.email === email, c.adminCurrentUser);
    if (findUser && findUser.id != userId) {
      throw new HttpException({ status: HttpStatus.CONFLICT, error: 'user with that email already exists!' }, HttpStatus.CONFLICT);
    }
  }

  async create(data: NewUserInput, currentUser: CurrentUserPayload): Promise<User> {
    this.validateFreeUserEmail(data.username, data.email);
    const password = hashPassword(data.password);
    const user = {
      ...data,
      id: data.id || newUuid(),
      password,
      roles: [UserRoles.ROLE_USER],
      // add date in epoch unix time
      createdDate: new Date().getTime(),
      createdBy: currentUser.userId,
    };
    return this.usersData.create(user, currentUser);
  }

  async findAll(paginationArgs: PaginationArgs, currentUser: CurrentUserPayload): Promise<User[]> {
    return this.usersData.findAll(paginationArgs.skip, paginationArgs.take, currentUser);
  }

  async findOneByField(key: string, value: string, currentUser?: CurrentUserPayload): Promise<AuthUser> {
    if (!currentUser) {
      currentUser = c.adminCurrentUser;
    };
    const findUser = this.usersData.find((e: UserData) => e[key] === value, currentUser);
    if (!findUser) {
      // throw new HttpException({ status: HttpStatus.NO_CONTENT, error: 'no content' }, HttpStatus.NO_CONTENT);
      throw new NotFoundException();
    }
    return findUser;
  }

  async update(data: UpdateUserInput, currentUser: CurrentUserPayload): Promise<User> {
    this.validateEmail(currentUser.userId, data.email);
    // double check if user Exists, or fail
    await this.findOneByField('id', data.id, currentUser);
    this.usersData.update(data.id, data as AuthUser, currentUser);
    // return mutated data
    return this.usersData.find((e: UserData) => e.id === data.id, currentUser);
  }

  async delete(data: DeleteUserInput, currentUser: CurrentUserPayload): Promise<{ id: string }> {
    // double check if user Exists, or fail
    await this.findOneByField('id', data.id, currentUser);
    return this.usersData.delete(data.id, currentUser);
  }

  async updatePassword(data: UpdateUserPasswordInput, currentUser: CurrentUserPayload): Promise<User> {
    let userToUpdate = await this.findOneByField('id', data.id, currentUser);
    userToUpdate.password = hashPassword(data.password);
    return userToUpdate;
  }

  async updateProfile(data: UpdateUserProfileInput, currentUser: CurrentUserPayload): Promise<User> {
    this.validateEmail(currentUser.userId, data.email);
    // double check if user Exists, or fail
    await this.findOneByField('id', currentUser.userId, currentUser);
    this.usersData.update(currentUser.userId, data as AuthUser, currentUser);
    // return mutated data
    return this.usersData.find((e: UserData) => e.id === currentUser.userId, currentUser);
  }
}
