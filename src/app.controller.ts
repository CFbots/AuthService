import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  ValidationPipe,
  UsePipes,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/createUser.dto';
import { User } from './users/entity/user.entity';
import passport from 'passport';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}
  @Post('signup')
  @UsePipes(ValidationPipe)
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('homepage')
  async getUsers(@Request() req) {
    // return req.user;
    const users = await this.userService.findAll();
    return users.map((user) => {
      return { id: user.id, username: user.username };
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('homepage/:username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...rest } = user;
    return rest;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteusers/:username')
  async deleteUserByUsername(
    @Param('username') username: string,
  ): Promise<User> {
    return await this.userService.deleteUserByUsername(username);
  }
}
