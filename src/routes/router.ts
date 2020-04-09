import { Router, ErrorRequestHandler, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction): void => {
    res.send('Yo');
});

export default router;