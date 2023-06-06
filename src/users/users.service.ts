import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createuser.dto';
import { BaseError } from 'src/common/errors/base.error';
import { Errors } from 'src/common/errors/errors.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    const user = this.usersRepository.findOne({ where: { id: id } });

    return user;
  }

  create(userData: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(userData);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new BaseError(Errors.USER_NOT_FOUND);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new BaseError(Errors.USER_NOT_FOUND);
    }

    return this.usersRepository.save(user);
  }
}
