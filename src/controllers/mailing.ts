import Router, { Request, Response } from 'express';
const router = Router();

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API);

router.post('/send', async (_: Request, res: Response) => {
  try {
    const status = await resend.emails.send({
      from: 'TST <asd@asd.dev>',
      to: ['fosol77763@shaflyn.com'],
      subject: 'Hello World',
      html: '<strong>It works!</strong>',
    });
    res.send('OK');
  } catch (error) {
    res.send(error);
  }
});

export default {
  basePath: '/mailing',
  router,
};
