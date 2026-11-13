# CloudFinance — AWS Serverless Personal Finance Dashboard

A serverless personal finance dashboard built with AWS services, HTML, CSS, and JavaScript. CloudFinance allows users to securely register, log in, and manage personal income and expenses through a responsive dashboard.

## Project Overview

CloudFinance is a cloud-based personal finance application designed to demonstrate how multiple AWS services can work together to build a secure, scalable serverless web application without managing traditional backend servers.

Users can create an account, securely sign in, and manage their financial transactions. Transaction data is stored in Amazon DynamoDB and associated with the authenticated user.

## Features

- User registration and email verification
- Secure login and logout
- Personal transaction management
- Add new income and expense transactions
- View saved transactions
- Edit existing transactions
- Delete transactions
- Transaction dates and readable date formatting
- Empty-state messaging
- Dark-themed dashboard
- User-specific transaction access
- Persistent cloud data storage

## AWS Architecture

CloudFinance uses the following AWS services:

| AWS Service | Purpose |
|---|---|
| Amazon S3 | Stores static website files |
| Amazon CloudFront | Delivers the website over HTTPS |
| AWS Amplify | Configures and connects the serverless backend |
| Amazon Cognito | Handles user authentication |
| Amazon DynamoDB | Stores financial transactions |
| AWS AppSync | Provides the GraphQL API used to access transaction data |

### Architecture Flow

1. Users access CloudFinance through Amazon CloudFront.
2. CloudFront retrieves static website files from a private Amazon S3 bucket.
3. AWS Amplify connects the frontend to the backend services.
4. Amazon Cognito authenticates users.
5. AWS AppSync processes transaction data requests.
6. Amazon DynamoDB stores and retrieves user-specific transactions.

## Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript (ES Modules)
- Vite

**Backend and Cloud Infrastructure**
- AWS Amplify Gen 2
- Amazon Cognito
- Amazon DynamoDB
- AWS AppSync
- Amazon S3
- Amazon CloudFront

**Development Tools**
- Visual Studio Code
- Node.js
- npm
- AWS CLI

## Security

Security was an important consideration during development.

- Amazon S3 Block Public Access is enabled.
- CloudFront uses Origin Access Control (OAC) to access the private S3 bucket.
- HTTPS is provided through CloudFront.
- Amazon Cognito handles user authentication.
- DynamoDB transaction records use owner-based authorization through Amplify.
- User data isolation was tested with two separate accounts.

## Project Structure

cloud-finance-dashboard/
│
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   ├── package.json
│   └── tsconfig.json
│
├── index.html
├── style.css
├── app.js
├── package.json
├── package-lock.json
├── amplify_outputs.json
├── .gitignore
└── README.md

Note: The `dist/` directory is generated when building the production frontend.

## Running the Project Locally

### Prerequisites

- Node.js and npm
- AWS account
- AWS CLI
- Visual Studio Code

### 1. Clone the repository

```bash
git clone https://github.com/Samsisay/cloud-finance-dashboard.git
cd cloud-finance-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure AWS credentials

Configure an AWS CLI profile with the required permissions.

### 4. Start the Amplify sandbox

```bash
npm run sandbox -- --profile cloudfinance
```

This deploys the development backend and generates the Amplify configuration file.

### 5. Start the frontend

In a second terminal:

```bash
npm run dev
```

Open the local development URL displayed by Vite.

## Production Build

To create the production frontend:

```bash
npm run build
```

Vite generates the production files in the `dist/` directory.

## Deployment

The production frontend is hosted using:

- Amazon S3 for static file storage.
- Amazon CloudFront for HTTPS content delivery.
- Origin Access Control to keep the S3 bucket private.

The backend uses AWS Amplify Gen 2 with Cognito, AppSync, and DynamoDB.

## Cost Considerations

The project was designed with a focus on minimizing AWS costs.

Cost-conscious decisions include:

- Using serverless services instead of maintaining a traditional backend server.
- Keeping the S3 bucket private.
- Reusing existing AWS resources.
- Monitoring AWS billing and setting budget alerts.
- Avoiding unnecessary infrastructure.

AWS services may incur charges depending on usage, configuration, region, and applicable free-tier or promotional eligibility. Always monitor your AWS billing dashboard.

## Learning Outcomes

Building CloudFinance provided hands-on experience with:

- Designing a serverless AWS architecture.
- Deploying static websites using S3 and CloudFront.
- Configuring CloudFront Origin Access Control.
- Implementing authentication with Amazon Cognito.
- Designing DynamoDB data models.
- Connecting frontend applications to AWS AppSync.
- Using AWS Amplify Gen 2.
- Implementing owner-based authorization.
- Testing CRUD operations against a cloud database.
- Building and deploying a production frontend.

## Future Improvements

Potential enhancements include:

- Monthly spending reports.
- Expense category charts.
- Monthly income and expense comparisons.
- Budget tracking.
- CSV transaction exports.
- Improved mobile dashboard experience.

## Project Status

**Core application implemented and deployed.**

- [x] Frontend dashboard
- [x] Cognito authentication
- [x] DynamoDB integration
- [x] Create, read, update, and delete transactions
- [x] User data isolation testing
- [x] S3 and CloudFront hosting
- [x] Production build
- [x] Live deployment verification
- [x] AWS cost review

---

**CloudFinance**

Built as a hands-on AWS serverless learning and portfolio project.


## AWS Architecture

CloudFinance uses a serverless AWS architecture to host the frontend, authenticate users, and store financial transactions.

### Architecture Components

| AWS Service | Purpose |
|---|---|
| Amazon S3 | Stores the static website files. |
| Amazon CloudFront | Delivers the website securely over HTTPS. |
| Amazon Cognito | Handles user registration, email confirmation, and sign-in. |
| AWS Amplify | Configures and connects the frontend to the backend services. |
| AWS AppSync | Provides the GraphQL API for transaction operations. |
| Amazon DynamoDB | Stores transaction records. |

### Application Flow

1. Users access the CloudFinance website through Amazon CloudFront.
2. CloudFront retrieves static website files from a private Amazon S3 bucket.
3. Amazon Cognito authenticates users.
4. The frontend uses AWS Amplify libraries to communicate with the backend.
5. AWS AppSync processes GraphQL requests.
6. Amazon DynamoDB stores and retrieves transaction records.
7. Owner-based authorization helps ensure users can access only their own transactions.

### Architecture Benefits

- Serverless design with no custom backend server to manage.
- Secure HTTPS content delivery.
- Managed user authentication.
- GraphQL API integration.
- Persistent transaction storage.
- Designed to keep infrastructure costs low.
