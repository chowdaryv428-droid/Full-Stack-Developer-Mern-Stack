# Harbor — Customer Care Registry

A full-stack Customer Care Registry where customers can raise complaints, admins can assign them to agents, agents can resolve them, and customers can provide feedback. Built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.

## Team Members

1. MANIKONDA VINAY
2. VEMULA ACHYUTH
3. RAVULAPALLI VIJAY KUMAR
4. SHAIL FIROZ
5. THATAPUDI MARIYADASU

## Features

* **Roles:** Customer, Agent, and Admin with separate dashboards and permissions.
* **Authentication:** JWT-based registration and login with encrypted passwords.
* **Complaint Lifecycle:** Open → Assigned → In Progress → Resolved → Closed.
* **Admin Dashboard:** Assign complaints, manage users, and view complaint statistics.
* **Agent Dashboard:** View assigned complaints, communicate with customers, and update complaint status.
* **Customer Dashboard:** Register complaints, track progress, send messages, and submit feedback.
* **Communication History:** Complete conversation history for every complaint.
* **Profile Management:** Users can update their profiles, while admins can manage all user accounts.

## Project Structure

```text
customer-care-registry/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

## Getting Started

### Prerequisites

* Node.js 18 or above
* MongoDB (Local or MongoDB Atlas)

### Backend

```bash
cd backend
cp .env.example .env
npm install
node seed.js
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Running the Project

1. Start the backend server.
2. Start the frontend application.
3. Open `http://localhost:5173`.
4. Login as Admin or register a new Customer account.
5. Create, assign, resolve, and close complaints.

## API Overview

<<<<<<< HEAD
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
>>>>>>>48a26b90bf394157692e967d6f36573328bbc528
=======
| Method         | Endpoint                         | Description             |
| -------------- | -------------------------------- | ----------------------- |
| POST           | `/api/auth/register`             | Register a customer     |
| POST           | `/api/auth/login`                | User login              |
| GET            | `/api/auth/me`                   | Get current user        |
| GET/PUT/DELETE | `/api/users/:id`                 | Manage users            |
| POST           | `/api/complaints`                | Create complaint        |
| GET            | `/api/complaints`                | Get complaints          |
| PUT            | `/api/complaints/:id/assign`     | Assign complaint        |
| PUT            | `/api/complaints/:id/status`     | Update complaint status |
| POST           | `/api/complaints/:id/messages`   | Send message            |
| POST           | `/api/complaints/:id/feedback`   | Submit feedback         |
| GET            | `/api/complaints/stats/overview` | Dashboard statistics    |

## Technologies Used

* MongoDB
* Express.js
* React.js (Vite)
* Node.js
* JWT Authentication
* Axios
* Bootstrap/CSS

## License

This project was developed as part of the **Full Stack Developer (MERN Stack)** internship/project.
>>>>>>> ffd27e0 (Fix README merge conflict and update README)
