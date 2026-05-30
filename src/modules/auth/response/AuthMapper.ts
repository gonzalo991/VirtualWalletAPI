import type { User as PrismaUser } from "@prisma/client";
import type { AuthResponse } from "./AuthResponse.dto";
import type { RefreshTokenResponse } from "./RefreshTokenResponse";

export class AuthMapper {
    static toDomain(prismaUser: PrismaUser, accessToken: string, refreshToken: string): AuthResponse {
        return {
            accessToken,
            refreshToken,
            user: {
                id: prismaUser.id,
                username: prismaUser.username,
                email: prismaUser.email,
            }
        }
    }

    static toRefreshTokenResponse(accessToken: string, refreshToken: string): RefreshTokenResponse {
        return {
            accessToken,
            refreshToken,
        }
    }
}