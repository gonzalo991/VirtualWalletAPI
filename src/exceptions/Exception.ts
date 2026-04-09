export const ControllerException = (message: string, statusCode: number = 500) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}

export const ServiceException = (message: string, statusCode: number = 500) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}

export const ValidationException = (message: string, statusCode: number = 400) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}

export const NotFoundException = (message: string, statusCode: number = 404) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}

export const UnauthorizedException = (message: string, statusCode: number = 401) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}

export const ForbiddenException = (message: string, statusCode: number = 403) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}

export const InvalidFieldsException = (message: string, statusCode: number = 422) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}

export const AlreadyExistsException = (message: string, statusCode: number = 409) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
}   