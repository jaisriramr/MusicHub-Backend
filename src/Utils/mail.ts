import * as sgMail from '@sendgrid/mail';

export const WelcomeMail = async ({
  to,
  name,
}: {
  to: string;
  name: string;
}) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

export const ForgotPasswordLinkMail = async ({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const query = {
      to: to,
      from: process.env.FROM_EMAIL,
      subject: 'Reset Password Link For MusicHub',
      html: `<div><h1>Hi ${name}, Please use the below link to reset your password.</h1><br /><a href="${process.env.CLIENT_URL}/reset/password/${token}">Click here to reset your password</a></div>`,
    };

    let response = await sgMail
      .send(query)
      .then(() => {
        return 'Reset Password Link Sent Successfully';
      })
      .catch((err) => {
        return err;
      });

    return response;
  } catch (err) {
    return err;
  }
};
