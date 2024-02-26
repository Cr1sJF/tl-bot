import Router, { Request, Response } from 'express';
import MessageService from '../services/Message';
const router = Router();

router.post('/movie', async (req: Request, res: Response) => {
  const data = req.body;

  console.log('PAYLOAD', req.body);
  const service = new MessageService();

  const result = await service.notifyNewMovie(
    typeof data === 'string' ? JSON.parse(data) : data
  );

  res.send({
    success: result,
  });
});

router.post('/show', async (req: Request, res: Response) => {
  const data = req.body;

  console.log('PAYLOAD', req.body);
  const service = new MessageService();

  const result = await service.getShowMessage(
    typeof data === 'string' ? JSON.parse(data) : data
  );

  res.send({
    success: result,
  });
});
router.post('/season', async (req: Request, res: Response) => {
  const data = req.body;

  console.log('PAYLOAD', req.body);
  const service = new MessageService();

  const result = await service.notifyNewSeason(
    typeof data === 'string' ? JSON.parse(data) : data
  );

  res.send({
    success: result,
  });
});
export default {
  basePath: '/jellyfin',
  router,
};
