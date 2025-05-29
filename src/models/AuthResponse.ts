/**
 * Represents the structure of an authentication response from the API.
 * 
 * @property access_token - The access token used to authenticate subsequent API calls.
 * @property token_type - The type of token (e.g., "Bearer").
 * @property expires_in - The token expiry time in seconds.
 */
export type AuthResponseType = {
    access_token: string;
    token_type: string;
    expires_in: string;
};

export class AuthResponse {
    /**
     * @param accessToken - The access token used to authenticate subsequent API calls.
     * @param tokenType - The type of token (e.g., Bearer).
     * @param expiresIn - Token expiry time in seconds.
     */
    constructor(
        public accessToken: string,
        public tokenType: string,
        public expiresIn: number
    ) { }

    /**
     * Factory method to create an AuthResponse object from raw API response.
     * @param data - The raw response body from the authentication API.
     * @returns An instance of `AuthResponse` instance.
     */
    static fromApiResponse(data: { access_token: string; token_type: string; expires_in: string }): AuthResponse {
        return new AuthResponse(data.access_token, data.token_type, parseInt(data.expires_in, 10));
    }

    /**
     * Calculates the exact timestamp when the token will expire.
     * @returns Date object representing the token expiry time.
     */
    getExpiryTime(): Date {
        const expiryTimeInMillis = Date.now() + this.expiresIn * 1000;
        return new Date(expiryTimeInMillis);
    }
}
