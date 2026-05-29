import { AppError } from "./AppError";

export const InvalidFieldsException = (
    message = "Invalid fields"
) => {
    return new AppError(message, 422);
};

export const UnauthorizedException = (
    message = "Unauthorized"
) => {
    return new AppError(message, 401);
};

export const NotFoundException = (
    message = "Resource not found"
) => {
    return new AppError(message, 404);
};

export const AlreadyExistsException = (
    message = "Resource already exists"
) => {
    return new AppError(message, 409);
};

export const ServiceException = (
    message = "Internal server error"
) => {
    return new AppError(message, 500);
};