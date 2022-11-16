import * as argon2 from "argon2"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default class UsersService {
    public async create(user: UserDTO) {
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
        } catch (error) {
            return { error: 'Error in storing user in DB.' }
        }
    }

    public async findByUsername(username: string) {
        return await prisma.user.findUnique({where: { username }})
    }

    public async findById(id: number) {
        return await prisma.user.findUnique({ where: { id }})
    }
}