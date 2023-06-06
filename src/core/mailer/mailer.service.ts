import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';
import { IConfirmationData } from './mailer.interfaces';
import { getSignUpTemplate } from './templates/signUpConfirm.template';
import {
  SIGN_UP_CONFIRMATION_EMAIL_SUBJECT,
  SIGN_UP_CONFIRMATION_EMAIL_TEXT,
} from './mailer.constants';

@Injectable()
export class Mailer {
  transporter: nodemailer.Transporter;
  private readonly url: string;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('API_URL');
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAILER_HOST'),
      port: this.configService.get<number>('MAILER_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAILER_USER'),
        pass: this.configService.get<string>('MAILER_PASS'),
      },
    });
  }

  async sendSignUpConfirmation(
    confirmationData: IConfirmationData,
  ): Promise<void> {
    const link = `${this.url}/auth/confirm/${confirmationData.confirmationToken}`;

    const mailerOptions = {
      from: this.configService.get<string>('MAILER_EMAIL_FROM'),
      to: confirmationData.user.email,
      subject: SIGN_UP_CONFIRMATION_EMAIL_SUBJECT,
      text: SIGN_UP_CONFIRMATION_EMAIL_TEXT,
      html: getSignUpTemplate(link),
    };

    await this.transporter.sendMail(mailerOptions, (error, info) => {
      console.log(error);
      console.log(info);
    });
  }
}
