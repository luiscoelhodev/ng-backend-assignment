import * as argon2 from "argon2"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default class UsersService {
    public async create(user: CreateUserDTO) {
        const userAlreadyExists = await prisma.user.findUnique({where: { username: user.username }})
        if (userAlreadyExists) return { error: 'This username is already in use!' }

        const hashPassword = await argon2.hash(user.password)

        try {
            await prisma.user.create({ data: {
                username: user.username,
                password: hashPassword,
                account: { create: {
                    balance: 100
                }}
            }})
            return { message: `User '${user.username}' was created successfully!` }
        } catch (error: any) {
            return { error, message: 'Error in storing user in DB.' }
        }
    }

    public async findByUsername(username: string) {
        return await prisma.user.findUnique({where: { username }})
    }

    public async findById(id: number) {
        return await prisma.user.findUnique({ where: { id }})
    }

    public async getAccountBalance(id: number) {  
        try {
            const { balance } = await prisma.account.findFirstOrThrow({ where: { id }})
            return { balance }    
        } catch (error) {
            return { error }
        }
    }
}