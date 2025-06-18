# [mpesa-node-js-sdk] M-Pesa SDK for NodeJS

[![npm version](https://img.shields.io/npm/v/@safaricom-et/mpesa-node-js-sdk.svg)](https://www.npmjs.com/package/@safaricom-et/mpesa-node-js-sdk) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://mit-license.org/Safaricom-Ethiopia-PLC)

## Overview

The M-Pesa Node.js SDK simplifies the integration of M-Pesa mobile payment services into your applications. It offers an intuitive API to manage core M-Pesa operations such as sending payments, receiving payments, checking account balances, and more. Whether you're building for the sandbox or production environment, this SDK helps streamline your workflow.

## Features

- **Authentication**: Generate and manage secure tokens for API access.
- **STK Push**: Effortlessly trigger M-Pesa payments to your customers via STK Push.
- **Customer to Business (C2B)**: Process customer payments with validation and confirmation callbacks.
- **Business to Customer (B2C)**: Easily send payments (Payouts for salaries, rewards, or refunds) from your business to customers.
- **Error Handling**: CBenefit from centralized and consistent error management for reliability.
- **Automatic Retries**: Request handling with automatic retries for improved success rates.
- **Logging**: Tailor log levels to your needs (Emergency upto Debug) for optimal debugging and monitoring.

## Requirements

- Node.js v22.8.0 or later is installed on your system.
- You have an M-Pesa Developer Account.
  - Register at M-Pesa Developer Portal. </br>
    \_Make sure to obtain your consumerKey and consumerSecret from the M-Pesa Developer Portal for authentication.\_\_

## Installation

Install the Package
Use your preferred package manager to install the M-Pesa NodeJS SDK:

```bash
npm install @safaricom-et/mpesa-node-js-sdk
```

or

```bash
yarn install @safaricom-et/mpesa-node-js-sdk
```

or

```bash
pnpm install @safaricom-et/mpesa-node-js-sdk
```

## Configuration Guide

### Set Up the Environment

To configure the SDK, create a .env file in your project root and add the following environment variables:

```dotenv
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_ENVIRONMENT=sandbox
```

_Set MPESA_ENVIRONMENT to production when deploying to live environments._

### Basic Configuration

Create an instance in your project by importing and configuring the SDK:

```nodejs
import { Mpesa } from 'mpesa-node-js-sdk';

const mpesa = new Mpesa({
  apiKey: process.env.MPESA_CONSUMER_KEY,
  secretKey: process.env.MPESA_CONSUMER_SECRET,
  environment: process.env.MPESA_ENVIRONMENT,
});

// Example: Check account balance
mpesa.accountBalance({
  shortCode: '123456',
  callbackUrl: 'https://yourcallback.url',
}).then(response => console.log(response))
  .catch(error => console.error(error));
```

### _Getting Started_

- ### MPesa Instance

  Detailed reference for the `MPesa` Instance, its core methods, authentication handling, payload types, response types, and expected errors.

- ### MPesa Class

  The `MPesa` class is the primary interface for interacting with the M-Pesa API. It provides core methods to handle authentication, STK Push, B2C payments, and URL registration while abstracting the complexity of API calls.

- ### Singleton Behavior

  The `MPesa` class follows the singleton design pattern to ensure only one instance is created during the application's lifecycle. This avoids redundant configurations and centralizes API interactions.

  Example

  ```nodejs
  import { MPesa } from 'mpesa-node-js-sdk';

  const mpesa = MPesa.getInstance({
      environment: 'sandbox',
      apiKey: 'your-api-key',
      secretKey: 'your-secret-key',
      retries: 3,
      logLevel: 'informational',
  });
  ```

  _const sameMpesa = MPesa.getInstance(); // Returns the same instance as above_ </br>
  If you call `MPesa.getInstance()` without passing configuration after the first call, it will reuse the previously initialized instance.

## Usage

### Step 1: Authentication

Handles automatic token generation and caching. You don't need to call this method directly as it is invoked automatically before making API requests.

**Example:**

```nodejs
await mpesa.authenticate(); // Generates a new token
```

**Errors:**

- AuthenticationError: _Thrown if token generation fails._

### Step 2: STK Push Integration

Initiates a payment request to a customer's phone using the M-Pesa STK Push API.

**Parameters:**

- _Payload:_ _An object of type StkPushPayloadType._

**Example:**

```nodejs
const payload = {
    BusinessShortCode: '123456',
    Password: 'base64-encoded-password',
    Timestamp: '20250101120000',
    TransactionType: 'CustomerPayBillOnline',
    Amount: 100,
    PartyA: '254700123456',
    PartyB: '123456',
    PhoneNumber: '254700123456',
    CallBackURL: 'https://your-callback-url.com',
    AccountReference: 'Ref123',
    TransactionDesc: 'Payment Description',
};

try {
    const response = await mpesa.stkPush(payload);
    console.log('STK Push Response:', response);
} catch (error) {
    console.error('STK Push failed:', error);
}
```

### Step 3: C2B Payment

Registers validation and confirmation URLs for receiving payment notifications.

**Parameters:**

- _Payload:_ _An object of type RegisterUrlPayloadType._

**Example:**

```nodejs
const payload = {
    ShortCode: '123456',
    ResponseType: 'Completed',
    CommandID: 'RegisterURL',
    ConfirmationURL: 'https://your-domain.com/c2b/confirmation',
    ValidationURL: 'https://your-domain.com/c2b/validation',
};

try {
    const response = await mpesa.registerC2BUrl(payload);
    console.log('C2B URL Registration Response:', response);
} catch (error) {
    console.error('C2B URL registration failed:', error);
}
```

### Step 4: B2C Payout

Processes business-to-customer payments.

**Parameters:**

- _Payload:_ _An object of type B2CPayloadType._

**Example:**

```nodejs
const payload = {
    InitiatorName: 'testapi',
    SecurityCredential: 'encrypted-password',
    CommandID: 'BusinessPayment',
    Amount: 500,
    PartyA: '101010',
    PartyB: '254700123456',
    Remarks: 'Payment for services',
    QueueTimeOutURL: 'https://your-domain.com/b2c/timeout',
    ResultURL: 'https://your-domain.com/b2c/result',
    Occassion: 'Bonus',
};

try {
    const response = await mpesa.b2cPayment(payload);
    console.log('B2C Payment Response:', response);
} catch (error) {
    console.error('B2C Payment failed:', error);
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine.

   ```bash
   git clone https://github.com/Safaricom-Ethiopia-PLC/mpesa-node-js-sdk.git
   ```

3. **Create a new feature branch**.

   ```bash
   git checkout -b feature/<your-feature-name>
   ```

4. **Make your changes** and commit them.

   ```bash
   git commit -am "Add new <short feature description>"
   ```

5. **Push your branch** to your fork.

   ```bash
   git push origin feature/<your-feature-name>
   ```

6. **Open a pull request** from your branch to the main repository.

## License

This project is licensed under the [MIT License](https://mit-license.org/Safaricom-Ethiopia-PLC). See the [LICENSE](LICENSE) file for more details.

---

_Happy coding with M-Pesa NodeJS SDK!_
