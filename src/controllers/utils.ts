import Router, { Request, Response } from 'express';
const router = Router();

router.get('/health', async (_: Request, res: Response) => {
  res.send("OK");
});

export default {
  basePath: '/utils',
  router,
};
