import { Controller, Post, Body, Get, Patch } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async Register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const data = await this.usersService.createUser(email, password);
    return { message: data.message };
  }

  @Post('login')
  async Login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const data = await this.usersService.loginUser(email, password);
    return { message: data.message };
  }

  @Post('logout')
  async Logout() {
    const data = await this.usersService.logoutUser();
    return { message: data.message };
  }

  @Get()
  getCurrentUser() {
    return this.usersService.getLoggedInUser();
  }

  @Patch()
  async updateUser(@Body('password') password: string) {
    const data = await this.usersService.updateUser(password);
    return { message: data.message };
  }
}
