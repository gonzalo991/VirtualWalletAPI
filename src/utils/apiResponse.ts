export class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: any;

    constructor(
        success: boolean,
        message: string,
        data?: T
    ) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    static success<T>(message: string, data?: T) {
        return new ApiResponse(true, message, data);
    }

    static error(message: string) {
        return new ApiResponse(false, message);
    }
}