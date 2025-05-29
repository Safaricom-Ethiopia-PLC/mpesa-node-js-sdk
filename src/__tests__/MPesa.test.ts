import { MPesa, MpesaConfig } from '../MPesa';
import { APIClient } from '../APIClient';
import { Logger, LogLevel } from '../Logger';
import { StkPushError, RegisterUrlError, B2CError, AuthenticationError } from '../errors/MPesaError';
import { StkPushPayloadType, StkPushResponseType } from '../models/StkPushResponse';
import { RegisterUrlPayloadType } from '../models/C2BUrlResponse';
import { B2CPayloadType } from '../models/B2CPaymentResponse';
import { AxiosHeaders } from 'axios';

jest.mock('../APIClient');
jest.mock('../Logger');

describe('MPesa', () => {
    const mockConfig: MpesaConfig = {
        environment: 'sandbox',
        apiKey: 'testApiKey',
        secretKey: 'testSecretKey',
        timeout: 5000,
        retries: 3,
        logLevel: LogLevel.Debug,
    };

    let mpesa: MPesa;
    let mockApiClient: jest.Mocked<APIClient>;
    let mockLogger: jest.Mocked<Logger>;

    beforeEach(() => {
        (APIClient as jest.Mock).mockImplementation(() => ({
            requestWithRetry: jest.fn(),
        }));
        (Logger as jest.Mock).mockImplementation(() => ({
            logInfo: jest.fn(),
            logWarning: jest.fn(),
            logError: jest.fn(),
            logCritical: jest.fn(),
            logDebug: jest.fn(),
        }));

        mpesa = MPesa.getInstance(mockConfig);
        mockApiClient = mpesa['apiClient'] as jest.Mocked<APIClient>;
        mockLogger = mpesa['logger'] as jest.Mocked<Logger>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('authenticate', () => {
        it('should throw an AuthenticationError on failure', async () => {
            mockApiClient.requestWithRetry.mockRejectedValueOnce({
                data: {
                    "resultCode": "999991",
                    "resultDesc": "Invalid client id passed."
                },
                status: 400,
                statusText: 'Bad request',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            await expect(mpesa['authenticate']()).rejects.toThrow(AuthenticationError);

            expect(mockLogger.logError).toHaveBeenCalledWith('Authentication failed', expect.anything());
        });

        it('should authenticate successfully and store access token', async () => {
            const mockAuthResponse = {
                access_token: 'testToken',
                expires_in: 3600,
                token_type: 'Bearer',
            };

            mockApiClient.requestWithRetry.mockResolvedValueOnce({
                data: mockAuthResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            await mpesa['authenticate']();

            expect(mockApiClient.requestWithRetry).toHaveBeenCalledWith(
                'GET',
                '/v1/token/generate?grant_type=client_credentials',
                undefined,
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${mockConfig.apiKey}:${mockConfig.secretKey}`
                        ).toString('base64')}`,
                    },
                }
            );
            expect(mpesa['accessToken']).toBe(mockAuthResponse.access_token);
            expect(mpesa['tokenExpiry']).toBeGreaterThan(Date.now());
        });
    });

    describe('stkPush', () => {
        it('should send STK Push request successfully', async () => {
            const payload: StkPushPayloadType = {
                "MerchantRequestID": "SFC-Testing-9146-4216-9455-e3947ac570fc",
                "BusinessShortCode": "554433",
                "Password": "123",
                "Timestamp": "20160216165627",
                "TransactionType": "CustomerPayBillOnline",
                "Amount": 10.00,
                "PartyA": 251700404789,
                "PartyB": 554433,
                "PhoneNumber": 251700404789,
                "TransactionDesc": "Monthly Unlimited Package via Chatbot",
                "CallBackURL": "https://apigee-listener.oat.mpesa.safaricomet.net/api/ussd-push/result",
                "AccountReference": "DATA",
                "ReferenceData": [
                    {
                        "Key": "BundleName",
                        "Value": "Monthly Unlimited Bundle"
                    },
                    {
                        "Key": "BundleType",
                        "Value": "Self"
                    },
                    {
                        "Key": "TINNumber",
                        "Value": "89234093223"
                    }
                ]
            };
            const mockResponse: StkPushResponseType = {
                MerchantRequestID: 'testRequestId',
                CheckoutRequestID: 'testCheckoutId',
                ResponseCode: '0',
                ResponseDescription: 'Success',
                CustomerMessage: 'Request accepted',
            };

            mockApiClient.requestWithRetry.mockResolvedValueOnce({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            const response = await mpesa.stkPush(payload);

            expect(mockApiClient.requestWithRetry).toHaveBeenCalledWith(
                'POST',
                '/mpesa/stkpush/v3/processrequest',
                payload,
                {
                    headers: {
                        Authorization: `Bearer testToken`,
                    },
                }
            );
            expect(response).toEqual(expect.any(Object));
        });

        it('should throw StkPushError on API failure', async () => {
            const payload: StkPushPayloadType = {
                "MerchantRequestID": "SFC-Testing-9146-4216-9455-e3947ac570fc",
                "BusinessShortCode": "554433",
                "Password": "123",
                "Timestamp": "20160216165627",
                "TransactionType": "CustomerPayBillOnline",
                "Amount": 10.00,
                "PartyA": 251700404789,
                "PartyB": 554433,
                "PhoneNumber": 251700404789,
                "TransactionDesc": "Monthly Unlimited Package via Chatbot",
                "CallBackURL": "https://apigee-listener.oat.mpesa.safaricomet.net/api/ussd-push/result",
                "AccountReference": "DATA",
                "ReferenceData": [
                    {
                        "Key": "BundleName",
                        "Value": "Monthly Unlimited Bundle"
                    },
                    {
                        "Key": "BundleType",
                        "Value": "Self"
                    },
                    {
                        "Key": "TINNumber",
                        "Value": "89234093223"
                    }
                ]
            };
            const mockErrorResponse: StkPushResponseType = {
                MerchantRequestID: '',
                CheckoutRequestID: '',
                ResponseCode: '1',
                ResponseDescription: 'Failed',
                CustomerMessage: 'Request failed',
            };

            mockApiClient.requestWithRetry.mockResolvedValueOnce({
                data: mockErrorResponse,
                status: 400,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            await expect(mpesa.stkPush(payload)).rejects.toThrow(StkPushError);

            expect(mockLogger.logWarning).toHaveBeenCalledWith(
                'STK Push request failed',
                { response: mockErrorResponse }
            );
        });
    });

    describe('registerC2BUrl', () => {
        it('should register C2B URL successfully', async () => {
            const payload: RegisterUrlPayloadType = {
                "ShortCode": 101010,
                "ResponseType": "Completed",
                "CommandID": "RegisterURL",
                "ConfirmationURL": "http://mydomain.com/c2b/confirmation",
                "ValidationURL": "http://mydomai.com/c2b/validation"
            };
            const mockResponse = {
                responseCode: '200',
                responseMessage: 'Request processed successfully',
            };

            mockApiClient.requestWithRetry.mockResolvedValueOnce({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            const response = await mpesa.registerC2BUrl(payload);

            expect(mockApiClient.requestWithRetry).toHaveBeenCalledWith(
                'POST',
                `/v1/c2b-register-url/register?apikey=${mockConfig.apiKey}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer testToken`,
                    },
                }
            );
            expect(response).toEqual(expect.any(Object));
        });

        it('should throw RegisterUrlError on API failure', async () => {
            const payload: RegisterUrlPayloadType = {
                "ShortCode": 101010,
                "ResponseType": "Completed",
                "CommandID": "RegisterURL",
                "ConfirmationURL": "http://mydomain.com/c2b/confirmation",
                "ValidationURL": "http://mydomai.com/c2b/validation"
            };
            const mockErrorResponse = {
                responseCode: '400',
                responseDescription: 'Failed',
            };

            mockApiClient.requestWithRetry.mockResolvedValueOnce({
                data: mockErrorResponse,
                status: 400,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            await expect(mpesa.registerC2BUrl(payload)).rejects.toThrow(RegisterUrlError);

            expect(mockLogger.logWarning).toHaveBeenCalledWith(
                'Register C2B Url failed',
                { response: mockErrorResponse }
            );
        });
    });

    describe('b2cPayment', () => {
        it('should make B2C payment successfully', async () => {
            const payload: B2CPayloadType = {
                "InitiatorName": "testapi",
                "SecurityCredential": "iSHJEgQYt3xidNVJ7lbXZqRXUlBqpM/ytL5incRQISaAYX/daObQopdHWiSVXJvexSoYCt9mmb6+TiikmTrGZm5fbaT1BeuPKDF9NFpOLG3n3hUZE2s5wNJvFxD3sM62cBdCQulFquFBc0CwHpq/K2cU1MN8lahvYp+vHnmGODogMBDk8/5Q+5CuRRFNRIt50xM0r10kUHVeWgUa71H6oK2RqXnog4EPTnanMlswz7N3J8jeIKzgGUwnJA8va5CvuNWu2B2L1cAm9g6pGribcgFZ2sgzByJpRWBkfntjGgzsYXh+K3fPZmxWyTQi7TscSvujH1EaS7JxvCIWMM3K0Q==",
                "Occassion": "Disbursement",
                "CommandID": "BusinessPayment",
                "PartyA": 101010,
                "PartyB": "251700100100",
                "Remarks": "Test B2C",
                "Amount": 12,
                "QueueTimeOutURL": "https://mydomain.com/b2c/timeout",
                "ResultURL": "https://mydomain.com/b2c/result"
            };

            const mockResponse = {
                ResponseCode: '0',
                ResponseDescription: 'Success',
            };

            mockApiClient.requestWithRetry.mockResolvedValueOnce({
                data: mockResponse,
                status: 400,
                statusText: 'OK',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            const response = await mpesa.b2cPayment(payload);

            expect(mockApiClient.requestWithRetry).toHaveBeenCalledWith(
                'POST',
                '/mpesa/b2c/v2/paymentrequest',
                payload,
                {
                    headers: {
                        Authorization: `Bearer testToken`,
                    },
                }
            );
            expect(response).toEqual(expect.any(Object));
        });

        it('should throw B2CError on API failure', async () => {
            const payload: B2CPayloadType = {
                "InitiatorName": "testapi",
                "SecurityCredential": "iSHJEgQYt3xidNVJ7lbXZqRXUlBqpM/ytL5incRQISaAYX/daObQopdHWiSVXJvexSoYCt9mmb6+TiikmTrGZm5fbaT1BeuPKDF9NFpOLG3n3hUZE2s5wNJvFxD3sM62cBdCQulFquFBc0CwHpq/K2cU1MN8lahvYp+vHnmGODogMBDk8/5Q+5CuRRFNRIt50xM0r10kUHVeWgUa71H6oK2RqXnog4EPTnanMlswz7N3J8jeIKzgGUwnJA8va5CvuNWu2B2L1cAm9g6pGribcgFZ2sgzByJpRWBkfntjGgzsYXh+K3fPZmxWyTQi7TscSvujH1EaS7JxvCIWMM3K0Q==",
                "Occassion": "Disbursement",
                "CommandID": "BusinessPayment",
                "PartyA": 101010,
                "PartyB": "251700100100",
                "Remarks": "Test B2C",
                "Amount": 12,
                "QueueTimeOutURL": "https://mydomain.com/b2c/timeout",
                "ResultURL": "https://mydomain.com/b2c/result"
            };

            const mockErrorResponse = {
                ResponseCode: '1',
                ResponseDescription: 'Failed',
            };

            mockApiClient.requestWithRetry.mockResolvedValueOnce({
                data: mockErrorResponse,
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: { headers: {} as AxiosHeaders },
            });

            await expect(mpesa.b2cPayment(payload)).rejects.toThrow(B2CError);

            expect(mockLogger.logWarning).toHaveBeenCalledWith(
                'B2C Payment failed',
                { response: mockErrorResponse }
            );
        });
    });
});
