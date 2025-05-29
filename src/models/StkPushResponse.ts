/**
 * Represents the structure of the response from the STK Push API.
 * 
 * @property MerchantRequestID - The global unique identifier for any submitted payment request.
 * @property CheckoutRequestID - The unique global unique identifier of the processed checkout transaction request.
 * @property ResponseCode - A Numeric status code that indicates the status of the transaction submission. 0 means successful submission and any other code means an error occurred.
 * @property ResponseDescription - An acknowledgment message from the API that gives the status of the request submission.
 * @property CustomerMessage - A message to be displayed to the customer.
 */
export type StkPushResponseType = {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
};

/**
 * Represents the payload required for the STK Push request.
 */
export type StkPushPayloadType = {
    MerchantRequestID: string;
    BusinessShortCode: string;
    Password: string;
    Timestamp: string;
    TransactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
    Amount: number;
    PartyA: number;
    PartyB: number;
    PhoneNumber: number;
    CallBackURL: string;
    AccountReference: string;
    TransactionDesc: string;
    ReferenceData: { Key: string; Value: string }[];
};

/**
 * Represents a response object from the STK Push API.
 * Provides methods for checking transaction success and generating a formatted string representation.
 */
export class StkPushResponse {
    constructor(
        public MerchantRequestID: string,
        public CheckoutRequestID: string,
        public ResponseCode: string,
        public ResponseDescription: string,
        public CustomerMessage: string
    ) { }

    /**
     * Factory method to create an instance from API response data.
     * @param data - The raw response data from the API.
     * @returns An instance of StkPushResponse.
     */
    static fromApiResponse(data: StkPushResponseType): StkPushResponse {
            return new StkPushResponse(
                data.MerchantRequestID,
                data.CheckoutRequestID,
                data.ResponseCode,
                data.ResponseDescription,
                data.CustomerMessage
            );
    }

    /**
     * Determines if the response indicates success.
     * @returns True if the response was successful, false otherwise.
     */
    isSuccess(): boolean {
        return this.ResponseCode === '0';
    }

    /**
     * Returns a formatted string for logging or displaying the response.
     * @returns A formatted string summarizing the response.
     */
    toString(): string {
        return `STK Push Response: ${this.ResponseDescription} (Code: ${this.ResponseCode})`;
    }
}