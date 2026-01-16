# Store Rating Application - System Design

## 1. System Overview

The Store Rating Application is a role-based web platform enabling users to discover stores and submit ratings (1–5 scale). Three user types with distinct capabilities: System Administrators (manage platform), Normal Users (submit ratings), and Store Owners (monitor store performance). Single unified authentication system with JWT-based token validation.

---

## 2. High-Level Architecture

**Three-tier architecture:**
- **Frontend (React.js):** Role-specific UI components, protected routes, client-side state management
- **Backend (Express.js):** REST API with authentication/authorization middleware, business logic, input validation
- **Database (PostgreSQL):** Normalized schema with ACID guarantees, data integrity constraints

**Communication Flow:**
```
React UI → REST API (JSON) → Express Server → PostgreSQL
  ↑                                              ↓
  └──────────────────────────────────────────────┘
```

---

## 3. Authentication & Authorization

**Authentication (Login Flow):**
- User submits email/password
- Backend validates credentials, hashes password with bcrypt
- Issues JWT token (payload: user_id, email, role, expiration)
- Client stores token, includes in Authorization header for subsequent requests

**Authorization Strategy:**
- Token validation middleware on all protected endpoints
- Role verification middleware checks user role against endpoint requirements
- Resource-level ownership checks (e.g., users modify only their own ratings)
- Invalid/expired tokens return 401; unauthorized roles return 403

---

## 4. Role-Based Access Control

| Role | Key Permissions | Restrictions |
|------|-----------------|--------------|
| **Admin** | Create users/stores, view dashboard, filter/sort listings | Cannot submit ratings |
| **Normal User** | Sign up, view stores, submit/update ratings, search | Cannot manage users/stores, view admin dashboard |
| **Store Owner** | View store ratings & users, update password | Cannot submit ratings, access admin features |

Middleware enforces role requirements; resource ownership verified at endpoint level.

---

## 5. Database Schema Overview

**Three core tables:**

**users**
- user_id (PK), name (20–60 chars), email (unique), password (hashed), address (max 400 chars), role (enum), timestamps
- Indexes: email (for login), role (for filtering)

**stores**
- store_id (PK), name, email (unique), address, owner_id (FK → users), timestamps
- Indexes: name (for search), owner_id (for owner queries)

**ratings**
- rating_id (PK), user_id (FK), store_id (FK), score (1–5 check constraint), timestamps
- Constraints: Unique(user_id, store_id) prevents duplicate ratings per user per store
- Indexes: store_id (for aggregation), user_id (for user's ratings)

**Relationships:**
- 1:N — One store owner → many stores
- 1:N — One user → many ratings
- 1:N — One store → many ratings

---

## 6. Key API Endpoints (by role)

**Authentication (Public)**
- `POST /auth/signup` — Register normal user
- `POST /auth/login` — Issue JWT token

**Admin**
- `GET /admin/dashboard` — View metrics (total users, stores, ratings)
- `GET /users` — List users with filters (name, email, role)
- `POST /users` — Create user/admin
- `GET /stores` — List stores with filters; `POST /stores` — Create store

**Normal User**
- `GET /stores` — List stores, search by name/address
- `POST /ratings` — Submit rating; `PUT /ratings/:id` — Update rating
- `GET /ratings/user/:id` — View own ratings

**Store Owner**
- `GET /owner/dashboard` — Store metrics (average rating, total ratings)
- `GET /owner/ratings` — Ratings for their store
- `GET /owner/users` — Users who rated their store

---

## 7. Key Data Flows

**Flow 1: User Registration & Login**
```
User submits signup → Backend validates input → Hash password (bcrypt) 
→ Insert user (role='user') → Frontend redirects to login 
→ User enters credentials → Backend validates, generates JWT 
→ Frontend stores token → Redirects to dashboard
```

**Flow 2: Rating Submission**
```
User views store list (GET /stores with auth token) 
→ Backend validates token, returns stores with user's existing rating (if any)
→ User selects score (1–5) → Frontend sends POST /ratings 
→ Backend checks if rating exists → INSERT (new) or UPDATE (existing)
→ Frontend updates UI with submitted rating
```

---

## 8. Security Considerations

- **Input Validation:** Server-side validation on all inputs; database constraints enforce additional rules
- **Password Security:** Bcrypt hashing, never store plaintext, constant-time comparison
- **JWT Security:** Signed with strong secret, includes expiration, transmitted over HTTPS
- **SQL Injection Prevention:** Parameterized queries on all database operations
- **CORS:** Whitelist allowed origins; restrict credentials
- **Error Handling:** Generic error messages to prevent information leakage
- **Environment Variables:** Store JWT_SECRET, DATABASE_URL in .env (never hardcoded)

---

## 9. Scalability & Maintainability

- **Database Indexing:** B-tree indexes on frequently queried columns (email, role, store_id); composite indexes for common filters
- **Query Optimization:** Use JOINs to avoid N+1 queries; pagination for large result sets
- **Caching:** Client-side state for store list; consider Redis for frequently accessed aggregates (average ratings)
- **Code Organization:** Separation of concerns (routes → controllers → services); reusable React components
- **Logging & Monitoring:** Track authentication attempts, errors, critical operations
- **Testing:** Unit tests (validation), integration tests (API endpoints), end-to-end tests (user flows)

---

## 10. Design Trade-offs & Key Decisions

| Decision | Why |
|----------|-----|
| **JWT over Session Storage** | Stateless, scalable, works seamlessly with REST APIs |
| **Role in JWT Payload** | Reduces database queries for permission checks; allows role updates via new token |
| **Bcrypt for Passwords** | Industry standard, salt generation built-in, GPU-resistant |
| **Unique(user_id, store_id)** | Database-level constraint prevents duplicate ratings at source |
| **On-Demand Average Rating** | Accurate, avoids denormalization; query optimized with indexes |
| **Limit/Offset Pagination** | Simple, works well for moderate datasets, sufficient for scope |
| **Query Parameter Filters** | RESTful convention, supports multiple simultaneous filters |
| **Admin-Only Store Creation** | Prevents unauthorized store creation, maintains data integrity |

---

## 11. Conclusion

The architecture prioritizes **security** (JWT + RBAC + validation), **scalability** (indexed queries, pagination, stateless auth), and **maintainability** (clear code organization, comprehensive validation). The system provides a robust, extensible foundation for a multi-role rating platform suitable for production-grade evaluation.