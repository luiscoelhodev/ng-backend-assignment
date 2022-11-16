import { Request, Response, Router } from 'express'
import UsersController from '../controllers/usersController'
import { authMiddleware } from '../middlewares/authentication'
const router = Router()
const usersController = new UsersController()

router.get('/hello', (_req: Request, res: Response) => {
    return res.status(200).send({ hello: 'world' })
})

router.post('/users/signup', usersController.signup)
router.post('/users/login', usersController.login)
router.get('/test-middleware', authMiddleware, (request: Request, response: Response) => {
    return response.send({user: request.user})
})

export { router }