import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.route('/').get((req: Request, res: Response, next: NextFunction): void => {

});

export default router;