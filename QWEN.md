# Qwen Context File for Dompet Backend

## Project Overview
Dompet is a comprehensive financial management backend designed to help users track and manage their wallets, accounts, transactions, and specialized savings/spending pockets. Built with modern technologies including Hono, PostgreSQL, Drizzle ORM, and Firebase Authentication.

## Project Structure
```
/home/capsvelte/Projects/dompet/backend/
├── db/                   # Database schema and configurations
│   ├── index.ts          # Database connection/index
│   └── schemas/          # Drizzle ORM schema definitions
├── src/                  # Main source code
│   ├── index.ts          # Main application entry point
│   ├── api/              # API controllers and routes
│   │   ├── accounts/     # Account management API
│   │   ├── pockets/      # Pockets management API
│   │   ├── transactions/ # Transaction management API
│   │   └── wallets/      # Wallet management API
│   ├── firebase-admin.ts # Firebase authentication setup
│   └── utils/            # Utility functions and helpers
├── drizzle.config.ts     # Drizzle ORM configuration
├── package.json          # Project dependencies and scripts
└── README.md            # Project documentation
```

## Technologies Used
- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Firebase Authentication
- **Validation**: [Zod](https://zod.dev/) for schema validation
- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Logging**: [Pino](https://getpino.io/) for structured logging

## Key Features
- Wallet Management: Create and manage multiple wallets with different currencies
- Transaction Tracking: Record and categorize income and expense transactions
- Pockets System: Organize funds into specialized savings or spending pockets
- Account Management: Manage different financial accounts
- Firebase Authentication: Secure user authentication and authorization
- PostgreSQL Database: Robust data storage with Drizzle ORM

## Database Schema
The application uses the following key database tables:
- accounts - User accounts with balance and type
- transactions - Financial transactions with account and pocket references
- pockets - Specialized savings/spending pockets (including recurring, saving, and spending pockets)
- transfers - Transaction transfers between accounts/pockets
- account-transfers, pocket-transfers - Junction tables for transfers
- wallet-pockets - Links wallets to pockets

## API Structure
The API is organized into four main modules:
- `/api/wallets` - Wallet management endpoints
- `/api/transactions` - Transaction management endpoints
- `/api/pockets` - Pockets management endpoints
- `/api/accounts` - Account management endpoints

All API endpoints require Firebase authentication via Bearer token in the Authorization header.

## Building and Running
### Prerequisites
- [Bun](https://bun.sh/) runtime
- PostgreSQL database
- Firebase project for authentication

### Setup
1. Install dependencies: `bun install`
2. Set up environment variables: `cp .env.example .env`
3. Configure Firebase and PostgreSQL connection details
4. Set up the database: `bun run db:push`

### Running the Application
- Development: `bun run dev`
- Server runs on `http://localhost:3000`

## Development Conventions
- All API endpoints follow RESTful principles
- Authentication is handled via Firebase tokens
- Request validation uses Zod schemas with @hono/zod-validator
- Error handling is centralized via errorHandler middleware
- Database operations use Drizzle ORM for type safety
- Logging uses Pino for structured logs

## Environment Variables
- DATABASE_URL - PostgreSQL database connection string
- FIREBASE_PROJECT_ID - Firebase project ID
- FIREBASE_PRIVATE_KEY - Firebase private key
- FIREBASE_CLIENT_EMAIL - Firebase client email
- PORT - Port to run the server on (default: 3000)

## Architecture Notes
- The project uses a case-based architecture for business logic (e.g., InitWalletCase, TopUpWalletCase)
- Firebase authentication is implemented as middleware that sets user context
- All routes under `/api/*` require authentication
- Each API module follows the same pattern with controller files that define routes
- Schemas in the db/schemas directory define the database structure using Drizzle ORM