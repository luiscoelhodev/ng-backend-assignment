import { Request, Response, Router } from 'express'
import UsersController from '../controllers/usersController'
const router = Router()
const usersController = new UsersController()

router.get('/hello', (_req: Request, res: Response) => {
    return res.status(200).send({ hello: 'world' })
})

router.post('/signup', usersController.signup)

export { router }