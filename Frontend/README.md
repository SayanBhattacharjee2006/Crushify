# CruSify Frontend

React + Vite frontend for the CruSify social app.

## Run Locally

1. Install dependencies:
   - `cd Frontend`
   - `npm install`
2. Start the frontend:
   - `npm run dev`
3. Make sure backend is running on `http://localhost:5000` (Vite proxies `/api` to this target).

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Implemented Features

- Authentication and session:
  - Email/password register, login, logout with Zustand auth store.
  - Google and GitHub OAuth login.
  - OAuth callback (`/auth/callback`) stores token and runs auth check.
  - Axios interceptor injects bearer token and handles `401` by clearing token and redirecting to `/login`.
- Routing and layouts:
  - `AuthLayout` and `AppLayout` route groups.
  - Alias redirects:
    - `/add-profile-picture` -> `/app/add-profile-picture`
    - `/complete-profile` -> `/app/complete-profile`
- Onboarding:
  - Add profile picture flow with image type/size validation, preview, upload, and skip.
  - Complete profile form for username, bio, pronouns, age, phone number, and gender.
- Home feed:
  - Feed loading with cursor-based pagination (`lastPostId`, `hasMore`, `isFetchingMore`).
  - Infinite scroll for loading more posts.
  - Post cards support follow/unfollow and like/unlike.
- Post creation:
  - Create post page with description + optional image.
  - Drag-and-drop and click-to-upload support.
  - Client validation for image type and 10MB max file size.
- Post details and comments:
  - Single post page (`/app/post/:id`) with full post view.
  - Add comment flow.
  - Comment listing with infinite scroll pagination.
  - Comment like/unlike actions.
- Profile:
  - Profile route (`/app/profile/:id`) for own/other user.
  - Follow status fetch + follow/unfollow actions.
  - Basic profile identity and social counters.
- Shared UI:
  - Reusable input components and password strength meter.
  - Navbar with navigation, profile shortcut, logout, and light/dark toggle.

## Known Gaps / Pending Work

- Route coverage:
  - Linked but missing routes: `/app/edit-profile`, `/app/details`, and `forgot-password`.
- Route-guard consistency:
  - `ProtectedRoute` exists but is not wired into `App.jsx` route definitions.
- Profile depth:
  - Edit profile UX, user details page, and followers/following listing screens are not implemented.
- Feed/comment UX polish:
  - Loading/error/empty states are basic.
  - Pagination limits are currently hardcoded in store calls.
- Comment replies:
  - Reply UI affordance exists, but nested reply flow is not implemented yet.
