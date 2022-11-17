import { Request, Response } from "express";
import AccountsService from "../providers/accountsService";
import TransactionsService from "../providers/transactionsService";
import UsersService from "../providers/usersService";
import { performTransactionSchema, usernameError } from "../validators/transactionsValidator";
const accountsService = new AccountsService()
const usersService = new UsersService()
const transactionsService = new TransactionsService()

export default class TransactionsController {
    public async sendMoneyToAnotherUser(request: Request, response: Response) {
        const { body } = request

        try {
            await performTransactionSchema.validateAsync(body, { abortEarly: false })
        } catch (error: any) {
            if (error.message.includes('required pattern')) {
                return response.status(422).send({ error: usernameError })
            }
            return response.status(422).send({ error: error.message })
        }

        if (body.to === request.user.username) {
            return response.status(400).send({ error: 'Username provided is your own. Please provide another one.' })
        }

        const loggedInUsersAccount = await accountsService.getAccountById(request.user.accountId)
        if (body.amount > loggedInUsersAccount!.balance) {
            return response.status(400).send({ error: 'You have insufficient funds to make this transfer.' })
        }

        const creditedUser = await usersService.findByUsername(body.to)
        if (!creditedUser) return response.status(404).send({ error: 'This recipient was not found.' })

        const transactionInfo: CreateTransactionDTO = {
            debitedAccountId: request.user.accountId,
            creditedAccountId: creditedUser.accountId,
            value: request.body.amount
        }
        const transactionWasMade = await transactionsService.createTransaction(transactionInfo)
        if (!transactionWasMade) return response.status(500).send({ error: 'Error in creating transaction.' })

        return response.send({ message: 'Your transfer was made successfully!' })

    }
}