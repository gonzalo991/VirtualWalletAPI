import { InvalidFieldsException } from "../exceptions/Exception.js";
import type { RegisterDto } from "../modules/auth/dto/Register.dto.js";
import type { CreateUserDto } from "../modules/user/dto/CreateUser.dto.js";
import type { UpdateUserDto } from "../modules/user/dto/UpdateUser.dto.js";

export const validateDtoFields = (
    dto: CreateUserDto | UpdateUserDto | RegisterDto
): void => {

    if (!dto) {
        throw InvalidFieldsException("Request body is missing");
    }

    const requiredFields = ["username", "email", "password"];

    const missingFields = requiredFields.filter(field =>
        !(field in dto) ||
        !(dto as any)[field] ||
        (dto as any)[field].trim() === ""
    );

    if (missingFields.length > 0) {
        throw InvalidFieldsException(
            `Missing required fields: ${missingFields.join(", ")}`
        );
    }

    console.debug("DTO validation passed");
};

export const validateEmail = (email: string): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw InvalidFieldsException("Invalid email format");
    }
    console.debug("Email validation passed");
}