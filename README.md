# Pet Shelter Backend

Backend API for a pet shelter application built with NestJS, Prisma, and PostgreSQL.

## Overview

This service manages:
- User authentication and JWT-based authorization
- Dog catalog with breeds and traits
- Adoption requests
- Orders and inventory stock updates
- Cloudinary image uploads for dog images

## Technologies

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport JWT
- Cloudinary
- class-validator / class-transformer

## Setup

```bash
cd "It dev/pet-shelter-backend"
yarn install
```

## Environment variables

Create a `.env` file with at least the following values:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=secret-for-jwt-module
JWT_ACCESS_SECRET=secret-for-access-token
JWT_REFRESH_SECRET=secret-for-refresh-token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Run

```bash
# development
yarn start

# watch mode
yarn start:dev
```

## Database

The Prisma schema includes the following main models:

- `User`
- `Dog`
- `Breed`
- `Trait`
- `AdoptionRequest`
- `Order`
- `OrderItem`

### Order model

Orders are created by authenticated users and include:
- `userId`
- `total`
- `status` (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- list of `OrderItem`s

### AdoptionRequest model

Adoption requests may contain:
- applicant name, phone, email
- experience description
- message
- dog reference
- optional user reference
- status (`NEW`, `IN_PROGRESS`, `APPROVED`, `REJECTED`)

## API Endpoints

### Auth

- `POST /auth/register`
  - Body: `{ email, password }`
  - Returns access and refresh tokens

- `POST /auth/login`
  - Body: `{ email, password }`
  - Returns access and refresh tokens

- `POST /auth/refresh`
  - Body: `{ refreshToken }`
  - Returns new access and refresh tokens

### Users

- `GET /users/adoption-preset`
  - Authenticated
  - Returns adoption form defaults from the latest request or user email

### Dogs

- `GET /dogs`
  - Public
  - Returns all dogs with breeds and traits

- `GET /dogs/:id`
  - Public
  - Returns a single dog by ID

- `POST /dogs`
  - Admin only
  - Creates a new dog with uploaded `images`

- `PATCH /dogs/:id`
  - Admin only
  - Updates dog data and optionally uploads new images

### Breeds

- `GET /breeds`
  - Returns all breeds

- `GET /breeds/:id`
  - Returns one breed

- `POST /breeds`
  - Admin only

- `PATCH /breeds/:id`
  - Admin only

- `DELETE /breeds/:id`
  - Admin only

### Traits

- `GET /traits`
  - Returns all traits

- `POST /traits`
  - Admin only

- `DELETE /traits/:id`
  - Admin only

### Adoption Requests

- `POST /adoption-request`
  - Authenticated users only
  - Creates a new adoption request

- `GET /adoption-request`
  - Admin only
  - Returns all adoption requests

### Orders

- `POST /orders`
  - Authenticated users only
  - Creates an order from cart items
  - Deducts product stock

- `GET /orders`
  - Authenticated users only
  - Admin sees all orders
  - Regular users see only their orders

- `GET /orders/:id`
  - Authenticated users only
  - Returns a specific order for the owner or admin

- `PATCH /orders/:id/status`
  - Admin only
  - Updates order status
  - If status becomes `CANCELLED`, product stock is restored

## Validation

Request validation is implemented with `class-validator` and `class-transformer` on DTOs.

## Notes

- All protected routes require `Authorization: Bearer <accessToken>`.
- Refresh tokens are stored hashed in the database for security.
- Cloudinary is used for image uploads when creating or updating dog entries.

## Build

```bash
yarn build
```

## License

This project is private and intended for internal use.
