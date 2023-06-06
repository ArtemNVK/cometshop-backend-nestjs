import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Sign Up' })
  @ApiBody({ type: SignUpDto })
  singup(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Get('/confirm/:token')
  @ApiOperation({ summary: 'Email confirmation link' })
  async confirmEmail(@Param('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Sign In' })
  @ApiBody({ type: SignInDto })
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
