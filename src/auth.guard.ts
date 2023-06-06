import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { Request } from 'express';
import { IAuthToken } from './common/common.interfaces';
import { CryptoService } from './common/crypto/crypto.service';
import { Errors } from './common/errors/errors.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly cryptoService: CryptoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('No token');
    }

    const token = authorization.slice(7);

    try {
      await this.cryptoService.verifyJWT<IAuthToken>(token);
      return true;
    } catch (err) {
      throw new UnauthorizedException(Errors.INVALID_TOKEN);
    }
  }
}
