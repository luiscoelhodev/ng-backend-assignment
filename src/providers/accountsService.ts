import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class AccountsService {
    public async getAccountById(id: number) {
        return await prisma.account.findFirst({where: { id }})
    }
}