import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  private loggedInUser: User = null;

  getLoggedInUser() {
    return this.loggedInUser ? this.loggedInUser : null;
  }

  async createUser(email: string, password: string) {
    const users: User[] = await this.userModel.find();
    let emailTaken = false;
    users.forEach((user: User) => {
      if (user.email === email) {
        emailTaken = true;
      }
    });
    if (!emailTaken) {
      const newUser = new this.userModel({
        email,
        password,
      });
      await newUser.save();
    } else {
      throw new NotFoundException('Email taken.');
    }

    return { message: 'Successfully created user.' };
  }

  async loginUser(email: string, password: string) {
    let newUser: User;
    let wrongPassword = false;
    const users: User[] = await this.userModel.find().exec();
    users.forEach((user: User) => {
      if (user.email === email && user.password === password) {
        newUser = user;
      } else if (user.email === email && user.password !== password) {
        wrongPassword = true;
      }
    });

    if (!newUser) {
      if (!wrongPassword) {
        throw new NotFoundException('Could not find user.');
      } else {
        throw new NotFoundException('Incorrect password.');
      }
    } else {
      this.loggedInUser = newUser;
    }

    return { message: 'Successfully logged in.' };
  }

  async updateUser(password: string) {
    const updatedUser = await this.findUser(this.loggedInUser.id);
    if (password) {
      updatedUser.password = password;
    }
    await updatedUser.save();
    this.loggedInUser = updatedUser;
    return { message: 'Successfully updated user.' };
  }

  private async findUser(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}
