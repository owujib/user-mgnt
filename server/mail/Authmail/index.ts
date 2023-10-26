import ejs from 'ejs';
import path from 'path';
import Email from '../Email';
import NodemialerService from '../NodemailerService';

interface Subject {
  title: string;
  [key: string]: any;
}
class AuthMail {
  to: string;

  send: (subject: Subject, html: any) => Promise<void>;

  constructor(email: any) {
    this.to = email;
    this.send = async (subject: any, html: any) => {
      return new Email({
        emailService: new NodemialerService(),
        email: this.to,
      }).sendMail({ subject, html });
    };
  }

  async sendWelcome(subject: Subject) {
    const html = await ejs.renderFile(
      path.resolve('views/mail/welcome.ejs'),
      {},
    );

    return this.send(subject, html);
  }

  async forgotPasswordMail(subject: Subject) {
    const html = await ejs.renderFile(
      path.resolve('views/mail/forgot-password-mail.ejs'),
      {
        code: subject?.code,
      },
    );
    return this.send(subject, html);
  }
}

export default AuthMail;
