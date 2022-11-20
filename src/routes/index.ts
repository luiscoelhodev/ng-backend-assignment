import { Request, Response, Router } from 'express'
import TestsController from '../controllers/testsController'
import TransactionsController from '../controllers/transactionsController'
import UsersController from '../controllers/usersController'
import { authMiddleware } from '../middlewares/authentication'
const router = Router()
const usersController = new UsersController()
const transactionsController = new TransactionsController()
const testsController = new TestsController()

// Public routes
router.get('/hello', testsController.hello)
router.post('/auth/signup', usersController.signup)
router.post('/auth/login', usersController.login)

// Private routes
router.get('/users/my-balance', authMiddleware, usersController.getUsersBalance)
router.get('/users/my-transactions', authMiddleware, usersController.getUsersTransactions)
router.post('/transactions/send', authMiddleware, transactionsController.sendMoneyToAnotherUser)

router.get('/test-middleware', authMiddleware, testsController.testMiddleware)

export { router }