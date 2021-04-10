import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  private loggedInUser: User = null; // current user

  getLoggedInUser() {
    return this.loggedInUser ? this.loggedInUser : null;
  }

  async createUser(email: string, password: string) {
    const users: User[] = await this.userModel.find();
    let emailTaken = false;
    users.forEach((user: User) => {
      if (user.email === email) {
        emailTaken = true; // found user with the same email address
      }
    });
    if (!emailTaken) {
      const hash = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        email,
        password: hash,
      });
      await newUser.save();
    } else {
      throw new NotFoundException('Email taken.');
    }

    return { message: 'Successfully created user.' };
  }

  async loginUser(email: string, password: string) {
    this.loggedInUser = null;
    let wrongPassword = false;
    const users: User[] = await this.userModel.find().exec();

    for (let i = 0; i < users.length; i++) {
      const match = await bcrypt.compare(password, users[i].password);
      if (users[i].email === email && match) {
        // if email and password match then login
        this.loggedInUser = users[i];
      } else if (users[i].email === email) {
        // if only email match then wrong password is entered
        wrongPassword = true;
      }
    }
    if (wrongPassword) {
      throw new NotFoundException('Incorrect password.');
    } else if (!this.loggedInUser) {
      throw new NotFoundException('Could not find user.');
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
