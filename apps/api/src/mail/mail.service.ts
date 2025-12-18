import { render } from '@react-email/components';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendingMailResponse, Email } from '@template/contracts';
import { TRPCError } from '@template/trpc/shared';

import {
  ConfirmationTemplate,
  PasswordRecoveryTemplate,
  TwoFactorAuthentication,
} from '@/mail/templates';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  private async sendMail(
    email: Email['email'],
    subject: string,
    html: string,
  ): Promise<SendingMailResponse> {
    const name = this.configService.getOrThrow<string>('APP_NAME');
    const address = this.configService.getOrThrow<string>('MAIL_LOGIN');

    try {
      await this.mailerService.sendMail({
        from: { name, address },
        to: email,
        subject,
        html,
      });
      return { sentMail: true };
    } catch (error) {
      throw new TRPCError({ message: 'Error sending email, please try later', code: 'CONFLICT' });
    }
  }

  public async sendMailEmailConfirmation(email: Email['email'], subject: string, link: string) {
    const html = await render(ConfirmationTemplate(link));

    return await this.sendMail(email, subject, html);
  }

  public async sendMailPasswordRecovery(email: Email['email'], subject: string, link: string) {
    const html = await render(PasswordRecoveryTemplate(link));

    return await this.sendMail(email, subject, html);
  }

  public async sendMailTwoFactorAuth(email: Email['email'], subject: string, token: string) {
    const html = await render(TwoFactorAuthentication(token));

    return await this.sendMail(email, subject, html);
  }
}
