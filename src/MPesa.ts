import { APIClient } from './APIClient';
import { AuthenticationError, B2CError, RegisterUrlError, StkPushError } from './errors/MPesaError';
import { AuthResponse, AuthResponseType } from './models/AuthResponse';
import { StkPushPayloadType, StkPushResponse, StkPushResponseType } from './models/StkPushResponse';
import { B2CPayloadType, B2CResponse, B2CResponseType } from './models/B2CPaymentResponse';
import { RegisterUrlPayloadType, RegisterUrlResponse, RegisterUrlResponseType } from './models/C2BUrlResponse';
import { LogLevel, Logger } from './Logger';

export interface MpesaConfig {
    environment: 'sandbox' | 'production';
    apiKey: string;
    secretKey: string;
    timeout?: number;
    retries?: number;
    logLevel?: LogLevel;
}

export class MPesa {
    private static instance: MPesa;
    private config: MpesaConfig;
    private apiClient: APIClient;
    private logger: Logger;

    public accessToken: string | null = null;
    public tokenExpiry: number | null = null;

    private constructor(config: MpesaConfig) {
        this.config = config;

        const defaultLogLevel = config.environment === 'sandbox' ? LogLevel.Debug : LogLevel.Error;
        const logLevel = config.logLevel ?? defaultLogLevel;
        this.logger = new Logger(logLevel);

        this.logger.logInfo('Logger initialized', { environment: config.environment, logLevel });

        const baseURL =
            config.environment === 'sandbox'
                ? 'https://apisandbox.safaricom.et'
                : 'https://api.safaricom.et';

        this.apiClient = new APIClient({
            baseURL,
            timeout: config.timeout,
            retries: config.retries,
        });

        this.logger.logInfo('APIClient initialized', { baseURL, timeout: config.timeout, retries: config.retries })
    }

    public static getInstance(config: MpesaConfig): MPesa {
        if (!MPesa.instance) {
            MPesa.instance = new MPesa(config);
        }
        return MPesa.instance;
    }

    public async authenticate(): Promise<void> {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return; // Token is still valid
        }

        const credentials = Buffer.from(
            `${this.config.apiKey}:${this.config.secretKey}`
        ).toString('base64');

        const headers = {
            Authorization: `Basic ${credentials}`,
        };

        try {
            const response = await this.apiClient.requestWithRetry<AuthResponseType>(
                'GET',
                '/v1/token/generate?grant_type=client_credentials',
                undefined,
                { headers }
            );

            const authResponse = AuthResponse.fromApiResponse(response.data)

            this.accessToken = authResponse.accessToken;
            this.tokenExpiry = Date.now() + authResponse.expiresIn * 1000;

            this.logger.logInfo('Authentication successful', { tokenExpiry: this.tokenExpiry })
        } catch (error) {
            this.logger.logError('Authentication failed', { error });

            if (typeof error === 'object' && error !== null && 'data' in error) {
                const errorData = (error as { data: { resultCode: string; resultDesc: string } }).data;
                const { resultCode, resultDesc } = errorData;
                throw new AuthenticationError(resultDesc, resultCode);
            }
            // Fallback for unexpected errors
            throw new AuthenticationError('Unexpected error during authentication', 'UNKNOWN_ERROR');
        }
    }

    private async makeAuthorizedRequest<T>(
        method: 'GET' | 'POST',
        endpoint: string,
        data?: unknown
    ): Promise<T> {
        this.logger.logDebug('Making authorized request', { method, endpoint, data });
        await this.authenticate();

        const headers = {
            Authorization: `Bearer ${this.accessToken}`,
        };

        try {
            const res = await this.apiClient.requestWithRetry<T>(method, endpoint, data, { headers });
            this.logger.logInfo('Request successful', { method, endpoint })
            return res.data;
        } catch (error) {
            this.logger.logError('Request failed', { method, endpoint, error });
            throw error;
        }
    }

    /**
     * Sends an STK Push request to the M-Pesa API.
     * @param payload - The payload for the STK Push request.
     * @returns A StkPushResponse instance representing the response.
     * @throws StkPushError if the API returns an error response.
     */
    public async stkPush(payload: StkPushPayloadType): Promise<StkPushResponse> {
        this.logger.logInfo('Initiating STK Push', { payload });
        try {
            const response = await this.makeAuthorizedRequest<StkPushResponseType>(
                'POST',
                '/mpesa/stkpush/v3/processrequest',
                payload
            );

            const stkPushResponse = StkPushResponse.fromApiResponse(response);

            if (!stkPushResponse.isSuccess()) {
                this.logger.logWarning('STK Push request failed', { response });
                throw new StkPushError('STK Push request failed', response);
            }

            return stkPushResponse;
        } catch (error) {
            if (error instanceof StkPushError) {
                this.logger.logError('STK Push-specific error occurred', { error });
                throw error;
            }

            this.logger.logCritical('Unexpected error occurred during STK Push', { error });
            throw new Error(`Unexpected error occurred during STK Push ${error}`);
        }
    }

    /**
     * Registers validation and confirmation URLs with the M-Pesa API.
     * @param payload - The payload for the Register URL request.
     * @returns A RegisterUrlResponse instance representing the response.
     * @throws RegisterUrlError if the API returns an error response.
     */
    public async registerC2BUrl(payload: RegisterUrlPayloadType): Promise<RegisterUrlResponse> {
        this.logger.logInfo('Initiating Register C2B Url', { payload })
        try {
            const response = await this.makeAuthorizedRequest<RegisterUrlResponseType>(
                'POST',
                `/v1/c2b-register-url/register?apikey=${this.config.apiKey}`,
                payload
            );

            const registerResponse = RegisterUrlResponse.fromApiResponse(response);

            if (!registerResponse.isSuccess()) {
                this.logger.logWarning('Register C2B Url failed', { response });
                throw new RegisterUrlError(
                    'Register URL request failed',
                    response
                );
            }

            return registerResponse;
        } catch (error) {
            if (error instanceof RegisterUrlError) {
                this.logger.logError('Regiter URL-specific error occured', { error })
                throw error;
            }

            this.logger.logCritical('Unexpected error occurred during Register URL', { error });
            throw new Error('Unexpected error occurred during Register URL');
        }
    }

    /**
     * Sends a B2C Pay Out request to the M-Pesa API.
     * @param payload - The payload for the B2C Pay Out request.
     * @returns A B2CResponse instance representing the response.
     * @throws B2CError if the API returns an error response.
     */
    public async b2cPayment(payload: B2CPayloadType): Promise<B2CResponse> {
        this.logger.logInfo('Initiating B2C Payment', { payload });
        try {
            const response = await this.makeAuthorizedRequest<B2CResponseType>(
                'POST',
                '/mpesa/b2c/v2/paymentrequest',
                payload
            );

            const b2cResponse = B2CResponse.fromApiResponse(response);

            if (!b2cResponse.isSuccess()) {
                this.logger.logWarning('B2C Payment failed', { response });
                throw new B2CError(
                    'B2C Pay Out request failed',
                    {
                        requestId: '--', // To-Do: modify error response type (`requestID` is known)
                        errorCode: b2cResponse.ResponseCode,
                        errorMessage: b2cResponse.ResponseDescription,
                    }
                );
            }

            return b2cResponse;
        } catch (error) {
            if (error instanceof B2CError) {
                this.logger.logError('B2C Payment-related error occurred', { error });
                throw error;
            }

            this.logger.logCritical('Unexpected error occurred during B2C Payment', { error });
            throw new Error('Unexpected error occurred during B2C Pay Out');
        }
    }
}
