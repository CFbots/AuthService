import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  createUser(createUserDto: CreateUserDto) {
    const password = encodePassword(createUserDto.password);
    console.log(password);
    const newUser = this.userRepository.create({ ...createUserDto, password });
    return this.userRepository.save(newUser);
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }
  async findAll(): Promise<User[] | undefined> {
    return this.userRepository.find();
  }

  // async deleteUserByUsername(username: string): Promise<DeleteResult> {
  //   return this.userRepository.delete({ username });
  // }
  async deleteUserByUsername(username: string): Promise<User> {
    const user = await this.findOne(username);
    await this.userRepository.remove(user);
    return user;
  }
}
