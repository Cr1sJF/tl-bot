import Router, { Request, Response } from 'express';
const router = Router();

router.post('/health', async (_: Request, res: Response) => {
  res.send("OK");
});

export default {
  basePath: '/utils',
  router,
};
