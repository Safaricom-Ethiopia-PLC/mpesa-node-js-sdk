import { StkPushResponseType } from "../models/StkPushResponse";

export class MPesaError extends Error {
    public name: string;

    constructor(message: string, name: string = 'MPesaError') {
        super(message);
        this.name = name;
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    }
}

export class AuthenticationError extends MPesaError {
    constructor(message: string, public code: string) {
        super(message, 'AuthenticationError');
    }
}

export class StkPushError extends MPesaError {
    public data: StkPushResponseType;

    constructor(message: string, data: StkPushResponseType) {
        super(message, 'StkPushError');
        this.data = data;
    }

    /**
     * Returns a formatted error message including details from the response.
     * @returns A detailed error message.
     */
    getDetails(): string {
        return `STK Push Error: ${this.data.ResponseDescription} (Code: ${this.data.ResponseCode})`;
    }
}

/**
 * Represents an error from the B2C Pay Out API.
 */
export class B2CError extends MPesaError {
    public data: {
        requestId: string;
        errorCode: string;
        errorMessage: string;
    };

    constructor(message: string, data: { requestId: string; errorCode: string; errorMessage: string }) {
        super(message, 'B2CError');
        this.data = data;
    }

    /**
     * Returns a formatted error message including details from the response.
     * @returns A detailed error message.
     */
    getDetails(): string {
        return `B2C Error: ${this.data.errorMessage} (Code: ${this.data.errorCode})`;
    }
}

/**
 * Represents an error from the Register URL API.
 */
export class RegisterUrlError extends MPesaError {
    public data: {
        responseCode: string;
        responseMessage: string;
        customerMessage: string;
        timestamp: string;
    };

    constructor(message: string, data: {
        responseCode: string;
        responseMessage: string;
        customerMessage: string;
        timestamp: string;
    }) {
        super(message, 'RegisterUrlError');
        this.data = {
            responseCode: data.responseCode,
            responseMessage: data.responseMessage,
            customerMessage: data.customerMessage,
            timestamp: data.timestamp,
        };
    }

    /**
     * Returns a formatted error message including details from the response.
     * @returns A detailed error message.
     */
    getDetails(): string {
        return `Register URL Error: ${this.data.responseMessage} (Code: ${this.data.responseCode})`;
    }
}

export class ApiError extends MPesaError { }