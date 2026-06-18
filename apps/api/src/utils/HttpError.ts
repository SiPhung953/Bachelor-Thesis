export class HttpError extends Error {
    public status: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.name = "HttpError";
        // Just in case tsoa expect error with .status
        this.status = statusCode;
        // Object.setPrototypeOf line helps instanceof HttpError behave reliably after TypeScript compilation.
        // Whatever that means.
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}