# CruSify Frontend

React + Vite frontend for the CruSify social app.

## Feature Status

### Done Features

- Auth with email/password:
  - Register, login, logout are wired through Zustand store actions (`register`, `login`, `logout`).
  - Forms include required-field checks and minimum password length validation.
- OAuth sign-in:
  - Google and GitHub OAuth redirect to backend auth routes.
  - Callback page (`/auth/callback`) saves token, runs `checkAuth`, then routes users into onboarding.
- Session persistence and API auth handling:
  - JWT is stored in `localStorage` and attached to every request through Axios interceptor.
  - On app load, token presence triggers `checkAuth`.
  - `401` responses clear token and redirect to `/login`.
- App routing and guard behavior:
  - Main routes are split into `AuthLayout` and `AppLayout`.
  - App routes redirect to login when not authenticated and no token exists.
  - Alias redirects are implemented:
    - `/add-profile-picture` -> `/app/add-profile-picture`
    - `/complete-profile` -> `/app/complete-profile`
- Onboarding flow:
  - Profile photo step (`/app/add-profile-picture`) supports file picking, image-type checks, size limit checks, preview, upload, and skip.
  - Profile completion step (`/app/complete-profile`) submits username, bio, pronouns, phone number, gender, and age.
- Profile and follow features:
  - Profile route (`/app/profile/:id`) loads own/other user details.
  - Follow status check, follow, and unfollow actions are connected to backend.
  - Profile UI shows basic identity and social counters.
- Shared UI foundations:
  - Reusable inputs/buttons and a password strength meter are used in auth forms.
  - Navbar includes app navigation, logout, profile shortcut, and light/dark mode toggle.

### Upcoming Features

- Home feed implementation:
  - `/app/home` is currently a placeholder and still needs feed cards, loading states, and pagination/infinite scroll using `/posts/feed`.
- Post workflow from frontend:
  - Create post UI, post details page, and post list rendering are not yet implemented.
  - Post actions (like, comments, replies) need frontend components and store/service integration.
- Missing linked routes/pages:
  - UI currently links to routes that do not exist yet:
    - `/app/features`
    - `/app/edit-profile`
    - `/app/details`
    - `forgot-password`
- Route protection consistency:
  - `ProtectedRoute` component exists but is not yet applied in route definitions; route-level guarding should be unified.
- Profile management improvements:
  - Edit profile UX, details page UX, and follower/following list views are pending.
