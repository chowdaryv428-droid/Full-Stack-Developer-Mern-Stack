<<<<<<< HEAD
# Harbor — Customer Care Registry

A full-stack Customer Care Registry: customers raise complaints, admins assign them
to agents, agents resolve them, and customers close the loop with feedback. Built
with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Roles**: customer, agent, admin — each with a tailored dashboard and permissions
- **Auth**: JWT-based registration and login with hashed passwords
- **Complaint lifecycle**: open → assigned → in progress → resolved → closed,
  visualized with a status gauge
- **Admin tools**: assign complaints to agents, filter by status, view registry-wide
  analytics (counts by status/category, average satisfaction rating), create agent
  accounts
- **Agent tools**: view assigned complaints, message the customer, update status and
  resolution notes
- **Customer tools**: raise complaints with category/priority, message the assigned
  agent, rate and close resolved complaints
- **Communication history**: every complaint keeps a running conversation thread
  between customer and agent
- **Profile management**: all users can update their own contact details; admins can
  manage any account

## Project structure

```
customer-care-registry/
├── backend/          Express API + MongoDB models
│   ├── config/       Database connection
│   ├── controllers/  Route handlers (auth, users, complaints)
│   ├── middleware/   JWT auth + role guard
│   ├── models/       Mongoose schemas (User, Complaint)
│   ├── routes/       Express routers
│   ├── seed.js       Creates a first admin account
│   └── server.js     App entry point
└── frontend/         React (Vite) client
    └── src/
        ├── api/       Axios client
        ├── components/  Shared UI (layout, status gauge, badges)
        ├── context/   Auth context (login/register/session)
        └── pages/     Login, Register, Dashboard, complaint flows, admin pages
```

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster)

### 1. Backend

```bash
cd backend
cp .env.example .env    # then edit MONGO_URI and JWT_SECRET
npm install
node seed.js             # creates admin@carecare.local / Admin@123
npm run dev               # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env     # points at http://localhost:5000/api by default
npm install
npm run dev                # starts the app on http://localhost:5173
```

### 3. Try it out
1. Open http://localhost:5173/login and sign in as `admin@carecare.local` /
   `Admin@123` (then change the password from the Profile page).
2. As admin, add an agent from **Agents**.
3. Open a private/incognito window, go to **Register**, and create a customer
   account.
4. As the customer, raise a complaint.
5. Back as admin, open the complaint from **All complaints** and assign it to the
   agent you created.
6. Sign in as the agent to message the customer and mark the complaint resolved.
7. Sign back in as the customer to rate the resolution and close the complaint.

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a customer account |
| POST | `/api/auth/login` | Public | Log in, receive a JWT |
| GET | `/api/auth/me` | Authenticated | Current user profile |
| GET/PUT/DELETE | `/api/users/:id` | Self or admin | View/update/delete a user |
| GET/POST | `/api/users` | Admin | List users / create agent or admin accounts |
| POST | `/api/complaints` | Customer | Raise a complaint |
| GET | `/api/complaints` | Authenticated | List complaints (scoped by role) |
| GET | `/api/complaints/:id` | Authenticated | Complaint detail |
| PUT | `/api/complaints/:id/assign` | Admin | Assign an agent |
| PUT | `/api/complaints/:id/status` | Agent/Admin | Update status + resolution notes |
| POST | `/api/complaints/:id/messages` | Authenticated | Post a message on a complaint |
| POST | `/api/complaints/:id/feedback` | Customer | Rate a resolved complaint and close it |
| GET | `/api/complaints/stats/overview` | Admin | Aggregate stats for the dashboard |

## Notes on customization
- **Custom fields**: `User.customFields` is a free-form map for
  industry-specific data — surface it in the Profile page and admin user editor as
  needed.
- **Notifications**: the architecture is ready for an email/SMS integration (e.g.
  SendGrid, Twilio) — the natural hook is inside `complaintController.js`, right
  after assignment and status changes.
- **Database**: swap MongoDB for MySQL/PostgreSQL by replacing the Mongoose models
  with an ORM (e.g. Prisma or Sequelize) — the controller logic and API contract can
  stay the same.
=======
# Full-Stack-Developer-Mern-Stack
Team members:
1.MANIKONDA VINAY
2.VEMULA ACHYUCH
3.RAVULAPALLI VIJAY KUMAR
4.SHAIL FIROZ
5.THATAPUDI MARIYADASU
>>>>>>>
