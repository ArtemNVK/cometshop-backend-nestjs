import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  encodeJWT(
    payload: string | object | Buffer,
    options: jwt.SignOptions = {},
  ): Promise<string> {
    const jwtPrivateKey = this.configService.get<string>('JWT_PRIVATE_KEY');

    return new Promise((resolve, reject) => {
      const signCallback: jwt.SignCallback = (err, token) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(token);
      };

      jwt.sign(payload, jwtPrivateKey, options, signCallback);
    });
  }

  verifyJWT<T>(token: string): Promise<T> {
    const jwtPrivateKey = this.configService.get<string>('JWT_PRIVATE_KEY');

    return new Promise((resolve, reject) => {
      const verifyCallback: jwt.VerifyCallback = (err: Error, payload) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(payload as T);
      };

      jwt.verify(token, jwtPrivateKey, null, verifyCallback);
    });
  }

  verify(hash: string, plain: string): Promise<boolean> {
    return argon.verify(hash, plain);
  }
}
