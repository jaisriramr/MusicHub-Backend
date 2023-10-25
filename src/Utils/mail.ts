import * as sgMail from '@sendgrid/mail';

export const WelcomeMail = async ({
  to,
  name,
}: {
  to: string;
  name: string;
}) => {
  try {
    const query = {
      to: to,
      from: process.env.FROM_EMAIL,
      subject: 'Welcome to MusicHub',
      html: `<h1>Hi ${name}, Welcome to MusicHub</h1>`,
    };

    let response = await sgMail
      .send(query)
      .then(() => {
        return 'Mail sent successfully';
      })
      .catch((err) => {
        return err;
      });

    return response;
  } catch (err) {
    return err;
  }
};
