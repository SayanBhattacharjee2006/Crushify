# CruSify Frontend

React + Vite frontend for the CruSify social app.

## Feature Status

### Done

- Email/password authentication (register, login, logout)
- Google and GitHub OAuth sign-in flow
- Auth persistence with token + `checkAuth` on app load
- Protected app layout and redirect flow
- Profile picture upload flow
- Profile completion form (username, bio, pronouns, phone, gender, age)
- Profile page with user details
- Follow/unfollow user actions with follow-status check
- Basic theme toggle (light/dark)

### Ongoing

- Home feed UI and feed data integration
- Post UI flow (create/list/details from frontend)
- Routes linked from UI but not implemented yet: `/app/features`, `/app/edit-profile`, `/app/details`, `forgot-password`
- Backend feed/comments retrieval endpoints not finished: `getFeed`, `getAllComents`
- User routes for liked/commented posts are still pending
