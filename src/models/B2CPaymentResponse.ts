/**
 * Represents the response from the B2C Pay Out API.
 */
export type B2CResponseType = {
    ConversationID: string;
    OriginatorConversationID: string;
    ResponseCode: string;
    ResponseDescription: string;
};

/**
 * Represents the payload required for the B2C Pay Out request.
 */
export type B2CPayloadType = {
    InitiatorName: string;
    SecurityCredential: string;
    CommandID: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment';
    Amount: number;
    PartyA: number;
    PartyB: string;
    Remarks: string;
    QueueTimeOutURL: string;
    ResultURL: string;
    Occassion: string;
};

/**
 * Represents the response object from the B2C Pay Out API.
 */
export class B2CResponse {
    constructor(
        public ConversationID: string,
        public OriginatorConversationID: string,
        public ResponseCode: string,
        public ResponseDescription: string
    ) { }

    /**
     * Factory method to create an instance from API response data.
     * @param data - The raw response data from the API.
     * @returns An instance of B2CResponse.
     */
    static fromApiResponse(data: B2CResponseType): B2CResponse {
        return new B2CResponse(
            data.ConversationID,
            data.OriginatorConversationID,
            data.ResponseCode,
            data.ResponseDescription
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
        return `B2C Response: ${this.ResponseDescription} (Code: ${this.ResponseCode})`;
    }
}