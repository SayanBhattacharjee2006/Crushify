# Crushify

Crushify is a full-stack social app prototype built with a React + Vite frontend and an Express + MongoDB backend. The current project includes local and OAuth authentication, profile onboarding, a home feed, post creation, likes, comments, replies, follow relationships, and profile pages.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS v4, React Router 7, Zustand, Axios
- Backend: Node.js, Express 5, MongoDB with Mongoose, Passport, JWT, Multer, Cloudinary

## Repository Structure

```text
Crushify/
|- Backend/    # Express API, MongoDB models, auth, posts, follows
|- Frontend/   # React app, Zustand stores, pages, components
`- FEATURES_OVERVIEW.md
```

## Current Feature Set

### Authentication

- Email/password registration and login
- Google OAuth login
- GitHub OAuth login
- JWT-based auth with cookie support and bearer-token fallback
- Current-user session check and logout

### Profile and Social Graph

- Avatar upload and avatar deletion
- Profile completion flow for username, bio, pronouns, phone number, gender, and age
- Follow and unfollow users
- Followers and following lists
- User profile pages with posts, followers, and following tabs

### Posts and Engagement

- Create a post with text and optional image
- Home feed with cursor-style infinite scrolling
- Like and unlike posts
- Post details page
- Add comments to posts
- Load comments with pagination
- Like and unlike comments
- Fetch replies for a comment
- Reply data model support in the backend

## Local Setup

### 1. Install dependencies

```powershell
cd Backend
npm install

cd ..\Frontend
npm install
```

### 2. Configure backend environment variables

Create `Backend/.env` with the values your local setup needs:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/auth/github/callback
```

Notes:

- The frontend does not currently require its own environment variables for local development.
- Vite proxies `/api` requests from `http://localhost:5173` to `http://localhost:5000`.
- Backend CORS is currently hardcoded for `http://localhost:5173`.

### 3. Start the backend

```powershell
cd Backend
npm run dev
```

The API starts on `http://localhost:5000`.

### 4. Start the frontend

```powershell
cd Frontend
npm run dev
```

The app starts on `http://localhost:5173`.

## Available Scripts

### Frontend

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build
- `npm run lint` runs ESLint

### Backend

- `npm run dev` starts the API with Nodemon
- `npm start` starts the API with Node

## API Surface

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/google`
- `GET /api/v1/auth/google/callback`
- `GET /api/v1/auth/github`
- `GET /api/v1/auth/github/callback`

### Users and Follows

- `POST /api/v1/users/avatar`
- `DELETE /api/v1/users/avatar`
- `POST /api/v1/users/complete-profile`
- `PATCH /api/v1/users/complete-profile`
- `GET /api/v1/users/liked-posts`
- `GET /api/v1/users/:id`
- `GET /api/v1/users/:id/posts`
- `POST /api/v1/users/:id/follow`
- `DELETE /api/v1/users/:id/follow`
- `GET /api/v1/users/:id/follow/status`
- `GET /api/v1/users/:id/followers`
- `GET /api/v1/users/:id/following`

### Posts and Comments

- `POST /api/v1/posts`
- `GET /api/v1/posts/feed`
- `DELETE /api/v1/posts/:postId`
- `GET /api/v1/posts/:postId`
- `POST /api/v1/posts/:postId/like`
- `DELETE /api/v1/posts/:postId/like`
- `POST /api/v1/posts/:postId/comments`
- `GET /api/v1/posts/:postId/comments`
- `DELETE /api/v1/posts/:postId/comments/:commentId`
- `POST /api/v1/posts/:postId/comments/:commentId/like`
- `DELETE /api/v1/posts/:postId/comments/:commentId/like`
- `GET /api/v1/posts/comments/:commentId/replies`

## Current Gaps

- `ProtectedRoute` exists in the frontend but route protection is handled indirectly in layout code rather than through that component.
- Linked frontend routes for `/app/edit-profile`, `/app/details`, and `forgot-password` are not implemented.
- The reply flow is only partial in the UI: reply data is supported, but the full nested reply experience is not complete.
- Loading, empty, and error states are still basic in several pages.
- Backend configuration is tuned for local development and will need cleanup before deployment.

## Notes

- `FEATURES_OVERVIEW.md` contains an additional implementation summary, but this README should be treated as the primary entry point for the repository.
- The existing [Frontend README](Frontend/README.md) still documents the frontend in more detail.
