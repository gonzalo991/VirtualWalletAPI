export const logger = {
    info: (message: string) => console.log(message),
    error: (message: string) => console.log(message),
    debug: (message: string) => {
        if (process.env.NODE_ENV === "development") {
            console.debug(message);
        }
    }
};