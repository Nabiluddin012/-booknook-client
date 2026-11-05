# BookNook – A Small Online Library

BookNook is a small online library where readers can discover books, add titles to a shared collection, borrow available copies, and return them.

**Live website:** https://booknook-library-delta.vercel.app

## Features

- Browse the full book collection and view recently added books.
- Register and sign in with email/password or Google (when OAuth credentials are configured).
- Add books with a cover image, category, description, and total copy count.
- Manage your own books: edit details or delete books that are not currently borrowed.
- Borrow books for a seven-day period and return them from the My Borrows table.
- Track available copies and prevent users from borrowing the same book twice at the same time.
- Protected routes and API requests using Better Auth sessions and JWT verification.

## Tech Stack

- **Client:** Next.js App Router, React, JavaScript, CSS, Swiper, Sonner
- **Authentication:** Better Auth, MongoDB Adapter, JWT plugin
- **Server:** Express.js, MongoDB, `jose`
- **Book cover uploads:** ImgBB

## Project Structure

```text
BookNook/
├── client/   # Next.js application
└── server/   # Express API
```

## Run Locally

Use a current Node.js LTS release. Install dependencies separately in both folders.

### 1. Start the API server

```bash
cd server
npm install
```

Copy `.env.example` to `.env`, fill in your MongoDB connection details and local client/auth URLs, then run:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 2. Start the Next.js client

Open a second terminal:

```bash
cd client
npm install
```

Copy `.env.example` to `.env.local` and fill in the required values. Then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `client/.env.example` and `server/.env.example` for the required variable names. Never commit `.env`, `.env.local`, real API keys, OAuth secrets, or database credentials.

## Deployment Notes

Deploy the client and API separately. Set the production client URL in the server's `CLIENT_URL` and `AUTH_BASE_URL`, and set the same production client origin in `BETTER_AUTH_URL`. Set `NEXT_PUBLIC_API_URL` to the deployed API base URL. Configure the Google OAuth callback URL in Google Cloud to match the deployed Better Auth callback endpoint. After deployment, replace the live website placeholder at the top of this README.
