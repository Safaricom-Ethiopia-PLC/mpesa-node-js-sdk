/**
 * Represents the response from the Register URL API.
 */
export type RegisterUrlResponseType = {
    responseCode: string;
    responseMessage: string;
    customerMessage: string;
    timestamp: string;
};

/**
 * Represents the payload required for the Register URL request.
 */
export type RegisterUrlPayloadType = {
    ShortCode: number;
    ResponseType: 'Canceled' | 'Completed';
    CommandID: 'RegisterURL';
    ValidationURL: string;
    ConfirmationURL: string;
};

/**
 * Represents the response object from the Register URL API.
 */
export class RegisterUrlResponse {
    constructor(
        public responseCode: string,
        public responseMessage: string,
        public customerMessage: string,
        public timestamp: string
    ) { }

    /**
     * Factory method to create an instance from API response data.
     * @param data - The raw response data from the API.
     * @returns An instance of RegisterUrlResponse.
     */
    static fromApiResponse(data: RegisterUrlResponseType): RegisterUrlResponse {
        return new RegisterUrlResponse(
            data.responseCode,
            data.responseMessage,
            data.customerMessage,
            data.timestamp
        );
    }

    /**
     * Determines if the response indicates success.
     * @returns True if the response was successful, false otherwise.
     */
    isSuccess(): boolean {
        return this.responseCode === '200';
    }

    /**
     * Returns a formatted string summarizing the response.
     * @returns A formatted string.
     */
    toString(): string {
        return `Register URL Response: ${this.responseMessage} (Code: ${this.responseCode})`;
    }
}
