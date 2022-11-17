import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function subtractHours(date: Date, hours: number) {
    date.setHours(date.getHours() - hours);
    return date;
  }

export default class TransactionsService {
    public async createTransaction(transactionObject: CreateTransactionDTO) {
        try {
            await prisma.transaction.create({ data: {
                debitedAccountId: transactionObject.debitedAccountId,
                creditedAccountId: transactionObject.creditedAccountId,
                value: transactionObject.value
            }})
            await prisma.account.update({where: { id: transactionObject.debitedAccountId }, data: { balance: { decrement: transactionObject.value } }})
            await prisma.account.update({where: { id: transactionObject.creditedAccountId }, data: { balance: { increment: transactionObject.value } }})
            return true
        } catch (error) {
            console.log(error)            
            return false
        }
    }

    public async getUsersTransactions(input: GetUsersTransactionsDTO) {

        if (!input.date && input.transactionType) {

            const transactions = (input.transactionType === 'in') ? 
            await prisma.transaction.findMany({ where: { creditedAccountId: input.accountId }}) : 
            await prisma.transaction.findMany({ where: { debitedAccountId: input.accountId }})
            
            return transactions
        }

        if (input.date && !input.transactionType) {
            const transactions = await prisma.transaction.findMany({ where: {
                OR: [
                    { debitedAccountId: input.accountId },
                    { creditedAccountId: input.accountId }
                ]
            }})

            const filteredTransactionsByDate = transactions.filter((transaction) => {
                const adjustedTransactionCreatedAt = subtractHours(transaction.createdAt, 3).toUTCString().slice(0, 16)
                const adjustedInputDate = new Date(input.date!).toUTCString().slice(0, 16)
                return adjustedInputDate === adjustedTransactionCreatedAt
            })

            return filteredTransactionsByDate
        }

        if (input.date && input.transactionType) {
            const transactions = (input.transactionType === 'in') ? 
            await prisma.transaction.findMany({ where: { creditedAccountId: input.accountId }}) : 
            await prisma.transaction.findMany({ where: { debitedAccountId: input.accountId }})
            
            const filteredTransactionsByDate = transactions.filter((transaction) => {
                const adjustedTransactionCreatedAt = subtractHours(transaction.createdAt, 3).toUTCString().slice(0, 16)
                const adjustedInputDate = new Date(input.date!).toUTCString().slice(0, 16)
                return adjustedInputDate === adjustedTransactionCreatedAt
            })

            return filteredTransactionsByDate
        }

        const transactions = await prisma.transaction.findMany({ where: {
            OR: [
                { debitedAccountId: input.accountId },
                { creditedAccountId: input.accountId }
            ]
        }})

        return transactions
    }
}