import type { User as PrismaUser } from "@prisma/client";
import type { AuthResponse } from "./AuthResponse.dto";

export class AuthMapper {
    static toDomain(prismaUser: PrismaUser, token: string): AuthResponse {
        return {
            token,
            user: {
                id: prismaUser.id,
                username: prismaUser.username,
                email: prismaUser.email,
            }
        }
    }
}