import type { User as PrismaUser } from '@prisma/client';
import { UserResponse } from './UserResponse.js'
import { User } from '../entity/User.js';

export class UserMapper {
    static toDomain(prismaUser: PrismaUser): User {
        return new User(
            prismaUser.id,
            prismaUser.username ?? undefined,
            prismaUser.email,
            prismaUser.password,
            prismaUser.createdAt,
        )
    }

    static toResponse(user: User): UserResponse {
        return new UserResponse(
            user.id,
            user.username,
            user.email,
            user.createdAt
        )
    }
}