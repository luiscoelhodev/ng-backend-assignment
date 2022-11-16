import { User } from "@prisma/client";

type UserWithoutPassword = {
    id: number;
    username: string;
    accountId: number
}

declare global {
    namespace Express {
        export interface Request {
            user: UserWithoutPassword
        }
    }
}