import Router, { Request, Response } from 'express';
const router = Router();

router.get('/health', async (_: Request, res: Response) => {
  res.send("OK");
});

router.get('/ping', async (_: Request, res: Response) => {
  res.send("PONG");
});

export default {
  basePath: '/utils',
  router,
};
