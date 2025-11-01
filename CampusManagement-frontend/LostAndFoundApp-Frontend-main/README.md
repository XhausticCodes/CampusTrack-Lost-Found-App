## Lost And Found Application Frontend (Vite + React)

Modern React frontend for a campus Lost & Found and student management experience. Built with Vite for fast DX, React Router for navigation, Axios for API calls, and Tailwind/Bootstrap for UI. 
- **Build tool**: Vite 7
- **UI**: React 19, Tailwind CSS 4, Bootstrap 5, React-Bootstrap
- **Routing**: React Router 7
- **HTTP**: Axios
- **Animations**: GSAP

---

### Features

- **Authentication**: Signup/Login flows with protected routes
- **Role-based menus**: Admin and Student dashboards
- **Lost & Found**:
  - Submit and track lost items
  - Submit and track found items
  - Fuzzy search and matching between lost/found items
  - Mark items as found/resolved
- **Profile page** for user details
- **Theme toggle** with context-powered dark/light mode

---

### Tech Stack

- **React 19**, **Vite 7**, **React Router 7**
- **Tailwind CSS 4**, **Bootstrap 5**, **React-Bootstrap**
- **Axios** for API communication
- **GSAP** for motion/animations
- **ESLint 9** for linting

---

### Configuration

API base URL is currently defined in code at:

- `src/Services/LoginService.jsx`
- `src/Services/ItemService.jsx`

Both files use:

```js
const BASE_URL = "http://localhost:9999/lost-found";
```

### Project Structure

```
campus-frontVite/
├─ public/
├─ src/
│  ├─ Auth/
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ Signin/
│  │  └─ Signup/
│  ├─ Components/
│  │  ├─ Dashboard/ (AdminMenu, StudentMenu)
│  │  ├─ FoundItem/ (Report, Submission, Track)
│  │  ├─ LostItem/ (Report, Submit, Track)
│  │  ├─ Buttons/ (ThemeToggleButton)
│  │  ├─ Profile.jsx, NotFound.jsx, MarkAsFound.jsx, DeleteStudentList.jsx
│  ├─ Context/ (ThemeContext.jsx)
│  ├─ Services/ (LoginService.jsx, ItemService.jsx)
│  ├─ App.jsx, main.jsx, styles
├─ index.html
├─ vite.config.js
├─ eslint.config.js
└─ package.json
```

---

### Routing and Auth

- `Auth/ProtectedRoute.jsx` guards routes that require authentication
- `Auth/Signin` and `Auth/Signup` provide forms and pages
- `Components/Dashboard` includes menus for role-specific navigation (Admin vs Student)
- `Components/NotFound.jsx` handles unknown routes

---

### UI/Styling

- Tailwind CSS utilities and Bootstrap components are both available
- `Components/Buttons/ThemeToggleButton.jsx` controls theme via `Context/ThemeContext.jsx`
- GSAP animations are used for richer motion where appropriate

---

### API Endpoints (Frontend usage)

Defined in `src/Services`:

- Auth: `register`, `login`, `logout`, `user/details`, admin student management
- Lost Items: CRUD, user-specific list
- Found Items: CRUD, user-specific list
- Fuzzy Matching & Search: endpoints to match/search lost and found items

All calls are made relative to `BASE_URL` noted above.

---

### Getting Started

Prerequisites:

- Node.js 18+ and npm 9+

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

> Note: The dev server runs on port `3939`.
