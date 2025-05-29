import axios, { AxiosError } from 'axios';
import { APIClient } from '../APIClient';

jest.mock('axios'); // Mock axios module
const mockedAxios = axios as jest.Mocked<typeof axios>;

(mockedAxios.create as jest.Mock).mockReturnValue(mockedAxios);

describe('APIClient', () => {
    const baseURL = 'https://example.com/api';
    const client = new APIClient({ baseURL });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize with default values', () => {
        expect(client).toBeDefined();
    });

    describe('requestWithRetry', () => {
        test('should handle successful GET request', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: { success: true } });

            const response = await client.requestWithRetry('GET', '/test');
            expect(response.data).toEqual({ success: true });
            expect(mockedAxios.get).toHaveBeenCalledWith('/test', undefined);
        });

        test('should retry on failure up to retry limit', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
            mockedAxios.get.mockResolvedValueOnce({ data: { success: true } });

            const response = await client.requestWithRetry('GET', '/test');
            expect(response.data).toEqual({ success: true });
            expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        });

        test('should throw error after exceeding retries', async () => {
            mockedAxios.get.mockRejectedValue(new Error('Network Error'));

            await expect(client.requestWithRetry('GET', '/test')).rejects.toThrow('Error: Network Error');
            expect(mockedAxios.get).toHaveBeenCalledTimes(3); // Default retries
        });
    });

    describe('fetchPaginated', () => {
        test('should aggregate results across pages', async () => {
            mockedAxios.get
                .mockResolvedValueOnce({
                    data: {
                        data: [1, 2],
                        next: '/page2',
                    },
                })
                .mockResolvedValueOnce({
                    data: {
                        data: [3, 4],
                        next: null,
                    },
                });

            const results = await client.fetchPaginated('/start', undefined, 'next', 'data');
            expect(results).toEqual([1, 2, 3, 4]);
        });
    });

    describe('handleError', () => {
        test('should throw error for response errors', () => {
            const error = {
                response: {
                    status: 500,
                    data: 'Server Error',
                },
            };

            expect(() => client['handleError'](error as AxiosError<unknown>)).toThrow(error.toString());
        });

        test('should throw error for network errors', () => {
            const error = new Error('Network Error');

            expect(() => client['handleError'](error as AxiosError<unknown>)).toThrow('Error: Network Error');
        });
    });
});
