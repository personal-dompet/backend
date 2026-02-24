# Dompet - Financial Management Backend

Dompet is a comprehensive financial management backend designed to help users track and manage their wallets, accounts, transactions, and specialized savings/spending pockets.

## Features

- **Wallet Management**: Create and manage multiple wallets with different currencies
- **Transaction Tracking**: Record and categorize income and expense transactions
- **Pockets System**: Organize funds into specialized savings or spending pockets
- **Account Management**: Manage different financial accounts
- **Firebase Authentication**: Secure user authentication and authorization
- **PostgreSQL Database**: Robust data storage with Drizzle ORM
- **RESTful API**: Clean API endpoints following industry standards

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Firebase Authentication
- **Validation**: [Zod](https://zod.dev/) for schema validation
- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Logging**: [Pino](https://getpino.io/) for structured logging

## API Endpoints

- `GET /api/wallets` - Retrieve user wallets
- `POST /api/wallets` - Create new wallet
- `GET /api/transactions` - Retrieve transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/pockets` - Retrieve pockets
- `POST /api/pockets` - Create new pocket
- `GET /api/accounts` - Retrieve accounts
- `POST /api/accounts` - Create new account

## Installation

### Prerequisites

- [Bun](https://bun.sh/) runtime
- PostgreSQL database
- Firebase project for authentication

### Setup

1. Clone the repository
2. Install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open <http://localhost:3000>
