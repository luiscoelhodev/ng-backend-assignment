import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
}