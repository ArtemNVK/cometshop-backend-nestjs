import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import Redis from 'ioredis';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { InjectRepository } from '@nestjs/typeorm';
import { MAIL_QUEUE_NAME } from 'src/core/configs/constants.config';
import { ConfigService } from '@nestjs/config';
import { BaseError } from 'src/common/errors/base.error';
import { Errors } from 'src/common/errors/errors.enum';
import { InjectQueue } from '@nestjs/bull';
import { IConfirmationData } from 'src/core/mailer/mailer.interfaces';
import { Events } from 'src/core/processors/mail.processor.enums';
import { ISignUpTokenPayload } from './auth.interfaces';
import { SignInDto } from './dto/signin.dto';

const confirmationKeyPrefix = 'signUpConfirmationKey_';

@Injectable()
export class AuthService {
  readonly AUTH_TOKEN_LIFETIME: string;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(CryptoService) private readonly cryptoService: CryptoService,
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectQueue(MAIL_QUEUE_NAME) private readonly mailQueue: Queue,
  ) {
    this.AUTH_TOKEN_LIFETIME = this.configService.get<string>(
      'AUTH_TOKEN_LIFETIME',
    );
  }

  async checkIfUserAlreadyExists(email: string): Promise<void> {
    const fetchedUser = await this.userRepository.findOne({ where: { email } });
    if (fetchedUser) {
      throw new BaseError(Errors.USER_ALREADY_EXISTS);
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password, ...rest } = signUpDto;
    await this.checkIfUserAlreadyExists(email);

    const hashedPassword = await this.cryptoService.hashPassword(password);
    const userDataWithHashedPassword = {
      email,
      password: hashedPassword,
      ...rest,
    };
    const createdUser = await this.userService.create(
      userDataWithHashedPassword,
    );

    await this.sendSignUpConfirmationData(createdUser);

    return createdUser;
  }

  async sendSignUpConfirmationData(user: User): Promise<void> {
    const tokenPayload: ISignUpTokenPayload = {
      userId: user.id,
    };

    const redisEntryLifeTime = 60 * 60 * 24;
    const confirmationToken = await this.cryptoService.encodeJWT(tokenPayload, {
      expiresIn: this.AUTH_TOKEN_LIFETIME,
    });

    const confirmationData: IConfirmationData = {
      user,
      confirmationToken,
    };
    await this.mailQueue.add(Events.SIGN_UP_CONFIRMATION, confirmationData);

    const confirmationKey = this.getSignUpConfirmationKey(confirmationToken);
    const confirmationValue = user.id;
    await this.redisClient.set(
      confirmationKey,
      confirmationValue,
      'EX',
      redisEntryLifeTime,
    );
  }

  async confirmEmail(token: string) {
    const userId = await this.redisClient.get(
      `${confirmationKeyPrefix}${token}`,
    );
    if (!userId) {
      throw new NotFoundException();
    }
    await this.userRepository.update(userId, { isConfirmed: true });
  }

  async signIn(signInData: SignInDto) {
    const user = await this.userService.findByEmail(signInData.email);

    if (!user) {
      throw new UnauthorizedException(Errors.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.cryptoService.verify(
      user.password,
      signInData.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(Errors.INVALID_CREDENTIALS);
    }

    const accessToken = await this.cryptoService.encodeJWT(
      { userId: user.id },
      { expiresIn: this.AUTH_TOKEN_LIFETIME },
    );

    return { user, authToken: accessToken };
  }

  private getSignUpConfirmationKey(key: string): string {
    return `${confirmationKeyPrefix}${key}` as const;
  }
}
