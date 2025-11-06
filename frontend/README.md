# 🌊 TidyApp Frontend

Modern React application for TidyApp - a comprehensive beach and surf community platform for Cape Town.

## 🏗️ Architecture

### Tech Stack

- **React 19** - UI library with concurrent features and hooks
- **React Router v7** - Client-side routing with data loading
- **TanStack Query v5** - Server state management, caching, and optimistic updates
- **Vite 7** - Next-generation build tool (fast HMR, optimized builds)
- **Mantine UI v8** - Comprehensive component library
- **Axios** - Promise-based HTTP client
- **CSS3** - Custom styling with CSS Modules for component isolation

### Design System

- **Ocean Theme**: Dark gradient background (#0a0f1e → #1a2332 → #0f172a)
- **Accent Color**: Ocean blue (#6dd5ed) and cyan (#2193b0)
- **Glassmorphism**: Backdrop blur with semi-transparent backgrounds
- **Typography**: System fonts with emoji fallback
- **Responsive**: Mobile-first design with breakpoints at 768px and 480px

## 📂 Project Structure

```
frontend/
├── src/
│   ├── main.jsx                # App entry point with providers
│   ├── App.jsx                 # Root component with routing
│   ├── index.css               # Global styles and CSS variables
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx                  # Main navigation bar
│   │   ├── Footer.jsx                  # Footer component
│   │   ├── GlobalDrawer.jsx            # Mobile navigation drawer
│   │   ├── AuthOverlayDrawer.jsx       # Login/register overlay
│   │   │
│   │   # Beach Components
│   │   ├── BeachCarousel.jsx           # Beach selector carousel
│   │   ├── BeachSlider.jsx             # Conditions slider
│   │   ├── BeachCam.jsx                # Beach webcam embed
│   │   ├── BeachMap.jsx                # Interactive map
│   │   ├── TideChart.jsx               # Tide graph with bezier curves
│   │   ├── WindCompass.jsx             # Wind direction visual
│   │   ├── HeroContainer.jsx           # Beach page hero
│   │   ├── InfoGrid.jsx                # Info cards grid
│   │   ├── FavoritesWatchlist.jsx      # Beach favorites
│   │   │
│   │   # Forum Components
│   │   ├── ForumHeroSection.jsx        # Forum landing hero
│   │   ├── ForumCategories.jsx         # Category grid
│   │   ├── ForumRecentActivity.jsx     # Recent posts list
│   │   ├── PinnedPosts.jsx             # Pinned posts display
│   │   ├── PostHeader.jsx              # Post metadata header
│   │   ├── PostFilters.jsx             # Tag/search filters
│   │   ├── CommentForm.jsx             # Top-level comment form
│   │   ├── InlineCommentForm.jsx       # Reply form component
│   │   ├── CommentsList.jsx            # Nested comments display
│   │   ├── MyForumPosts.jsx            # User's posts widget
│   │   ├── UserPostsList.jsx           # Posts list component
│   │   │
│   │   # Social Components
│   │   ├── FriendsManager.jsx          # Friends list UI
│   │   └── ApiDataViewer.jsx           # Debug API viewer
│   │
│   ├── pages/                  # Route components
│   │   ├── HomePage.jsx                # Landing page
│   │   ├── DashboardPage.jsx           # User dashboard
│   │   ├── LoginPage.jsx               # Login/register page
│   │   │
│   │   # Beach Pages
│   │   ├── BeachPage.jsx               # Beach details
│   │   │
│   │   # Forum Pages
│   │   ├── ForumHomePage.jsx           # Forum landing
│   │   ├── CategoryPage.jsx            # Category view
│   │   ├── SubcategoryPage.jsx         # Subcategory view
│   │   ├── PostDetailPage.jsx          # Single post with comments
│   │   ├── CreatePostPage.jsx          # New post form
│   │   ├── EditPostPage.jsx            # Edit post form
│   │   │
│   │   # User Pages
│   │   ├── UserProfilePage.jsx         # Public profile
│   │   └── ProfileSettingsPage.jsx     # User settings
│   │
│   ├── context/                # React Context providers
│   │   ├── UserContext.jsx             # Authentication state
│   │   ├── UIContext.jsx               # UI state (drawer, theme)
│   │   └── PostDetailContext.jsx       # Post detail state
│   │
│   ├── services/               # API service layer
│   │   ├── authService.js              # Auth API calls
│   │   ├── forumService.js             # Posts API
│   │   ├── commentService.js           # Comments API
│   │   ├── friendService.js            # Friends API
│   │   ├── adminService.js             # Admin API
│   │   ├── tideService.js              # Tide data API
│   │   ├── seaLevelService.js          # Sea level API
│   │   └── openMeteoService.js         # Weather API
│   │
│   ├── mutations/              # React Query mutations
│   │   ├── postMutations.js            # Post CRUD mutations
│   │   └── commentMutations.js         # Comment CRUD mutations
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTideData.js              # Tide data fetching
│   │   └── useAuth.js                  # Auth hook (if exists)
│   │
│   ├── config/                 # Configuration files
│   │   ├── forumCategories.js          # Forum structure
│   │   ├── beachTags.js                # Beach tagging system
│   │   ├── beaches.js                  # Beach coordinates
│   │   ├── api.js                      # API base URLs
│   │   ├── beachApiConfig.js           # Beach API config
│   │   └── cacheConfig.js              # React Query cache config
│   │
│   ├── data/                   # Static data
│   │   └── beachInfo.js                # Beach details, amenities
│   │
│   ├── utils/                  # Helper functions
│   │   ├── forumHelpers.js             # Date formatting, etc.
│   │   └── forumHandlers.js            # Legacy handlers
│   │
│   └── assets/                 # Static assets
│       ├── images/                     # Images
│       └── logo.svg                    # App logo
│
├── public/                     # Public static files
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see [backend README](../backend/README.md))

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment** (optional)

   Create `.env` file:

   ```env
   # Backend API URL (default: http://localhost:5000/api)
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173`

### Development Commands

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🎨 Component Architecture

### State Management

**TanStack Query (React Query)**

- Server state synchronization
- Automatic background refetching
- Optimistic updates
- Request deduplication
- Infinite query support

**React Context**

- Global UI state (drawer open/closed)
- Authentication state (user, login status)
- Post detail context (for nested components)

### Component Patterns

**Container/Presentational Pattern**

- Smart components fetch data and handle logic
- Presentational components receive props and render UI

**Composition Pattern**

- Small, focused components
- Composed together for complex UIs

**Example: Comments System**

```jsx
<CommentsList>
  {comments.map(comment => (
    <Comment key={comment._id}>
      <CommentHeader user={comment.author} date={comment.createdAt} />
      <CommentContent content={comment.content} />
      <CommentActions onLike={...} onReply={...} onEdit={...} />
      {comment.replies && (
        <CommentsList comments={comment.replies} nested />
      )}
    </Comment>
  ))}
</CommentsList>
```

## 🔌 API Integration

### Service Layer Pattern

All API calls go through service functions in `src/services/`:

```javascript
// services/forumService.js
export const getPosts = async (params = {}) => {
  const response = await axios.get(`${API_URL}/posts`, {
    params,
    withCredentials: true,
  });
  return response.data; // { success: true, posts: [...], pagination: {...} }
};
```

### React Query Usage

```javascript
// In component
const { data, isLoading, error } = useQuery({
  queryKey: ["posts", category],
  queryFn: () => getPosts({ category }),
});

const posts = data?.posts || [];
```

### Mutations with Optimistic Updates

```javascript
// mutations/postMutations.js
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate posts cache
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// In component
const createPostMutation = useCreatePost();

const handleSubmit = (postData) => {
  createPostMutation.mutate(postData, {
    onSuccess: () => {
      navigate("/forum");
    },
  });
};
```

## 📱 Responsive Design

### Mobile-First Approach

All styles start with mobile layout and scale up:

```css
/* Mobile (default) */
.component {
  padding: 1rem;
  font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
    font-size: 1.25rem;
  }
}
```

### Touch Optimization

- Larger tap targets (min 44px × 44px)
- Disabled hover effects on touch devices:
  ```css
  @media (hover: hover) {
    .button:hover {
      transform: scale(1.05);
    }
  }
  ```
- Natural scrolling (no forced snap)
- Swipe gestures for carousels

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Extra small**: < 480px (for very small phones)

## 🎭 Styling Approach

### CSS Modules

Component-specific styles are scoped with CSS Modules:

```jsx
// Component.jsx
import styles from "./Component.module.css";

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>;
```

### Global Styles

Global styles and CSS variables in `src/index.css`:

```css
:root {
  /* Colors */
  --color-primary: #6dd5ed;
  --color-secondary: #2193b0;
  --color-background: #0a0f1e;
  --color-surface: rgba(255, 255, 255, 0.05);
  --color-text: #e0e6ed;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

### Glassmorphism Effect

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}
```

## 🧩 Key Features Implementation

### Beach Carousel

- Horizontal scroll on mobile (85vw card width)
- Pagination dots for navigation
- Circular navigation (last → first, first → last)
- Soft gradient masks on edges
- Natural momentum scrolling

### Tide Chart

- Canvas-based rendering
- Smooth bezier curves between tide points
- Current time indicator
- Responsive sizing
- High/low tide labels
- Time axis with proper formatting

### Forum System

- **Categories & Subcategories**: Hierarchical organization
- **Threaded Comments**: Nested replies with depth indicators
- **Real-time Updates**: React Query auto-refetch
- **Optimistic UI**: Instant feedback on actions
- **Rich Content**: Sanitized HTML support
- **Moderation**: Admin tools (pin, disable comments, edit/delete)

### Friends System

- Send/accept/reject friend requests
- Friend list display
- Friend request notifications
- Profile linking

## 🔐 Authentication Flow

### Login/Registration

1. User clicks "Login" in navbar
2. `AuthOverlayDrawer` opens
3. User submits credentials
4. Service calls `/api/auth/login` or `/api/auth/register`
5. Backend returns JWT in HttpOnly cookie
6. Frontend calls `/api/auth/me` to get user data
7. User data stored in `UserContext`
8. Protected routes become accessible

### Protected Routes

```jsx
// In App.jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>;

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return children;
};
```

### Logout

1. User clicks "Logout"
2. Call `/api/auth/logout` to clear cookie
3. Clear user data from `UserContext`
4. Redirect to home page

## 🚀 Build & Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Deployment Platforms

**Recommended: Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Other Options:**

- **Netlify** - Drag & drop `dist/` folder
- **GitHub Pages** - Use `gh-pages` package
- **Cloudflare Pages** - Connect GitHub repo
- **AWS S3 + CloudFront** - Static hosting
- **Firebase Hosting** - Google's hosting platform

## 📚 Additional Resources

- [Main Project README](../README.md)
- [Backend README](../backend/README.md)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Mantine UI Docs](https://mantine.dev/)

## 🤝 Contributing

When contributing to the frontend:

1. Follow existing component structure
2. Use CSS Modules for component styles
3. Implement proper loading and error states
4. Ensure mobile responsiveness
5. Add PropTypes or TypeScript types
6. Test on multiple browsers and devices
7. Keep components focused and reusable

---

**Built with React and Vite for the TidyApp beach community platform**
