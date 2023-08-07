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
  getHome(@Request() req) {
    // return req.user;
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('homepage/:username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Delete('users/:username')
  async deleteUserByUsername(
    @Param('username') username: string,
  ): Promise<User> {
    return await this.userService.deleteUserByUsername(username);
  }
}
