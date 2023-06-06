import { Logger } from '@nestjs/common';
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';

import { Job } from 'bull';
import { Mailer } from '../mailer/mailer.service';
import { IConfirmationData } from '../mailer/mailer.interfaces';
import { Events } from './mail.processor.enums';
import { MAIL_QUEUE_NAME } from '../configs/constants.config';

@Processor(MAIL_QUEUE_NAME)
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailer: Mailer) {}

  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: Record<string, unknown>): void {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job, error: Error): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(Events.SIGN_UP_CONFIRMATION)
  async handleSignUpConfirmation(job: Job<IConfirmationData>): Promise<void> {
    const { data } = job;
    this.logger.log(`Sending confirmation email to '${data.user.email}'`);
    console.log('IM HERE');

    try {
      console.log('IM HERE');
      await this.mailer.sendSignUpConfirmation(data);
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email to '${data.user.email}'`,
        error,
      );
      throw error;
    }
  }
}
