# 🖥️ Dental Scheduler Backend (Node.js + Express)

This is the backend server for the Dental Scheduler Application built for the Junior Full Stack Developer technical assessment.

The backend provides RESTful APIs to manage:

- User registration and authentication (JWT)
- Booking dental appointments
- Updating appointment status (cancel, complete)
- Viewing user-specific appointments

The backend is **Dockerized** and **deployed on AWS EKS (Elastic Kubernetes Service)**.

---

## 📚 Tech Stack

| Area             | Technology            |
| :--------------- | :-------------------- |
| Server Framework | Node.js, Express.js   |
| Database         | MySQL (AWS RDS)       |
| Deployment       | Docker, AWS EKS       |
| Authentication   | JWT (JSON Web Tokens) |

---

## ✨ Features

- User Registration (`/register/user`)
- User Login (`/login`)
- Create Appointment (`/appointments/create`)
- View User Appointments (`/user-appointments`)
- Update Appointment Status (`/appointments/update`)
- JWT-protected routes
- Password hashing with bcrypt
- Environment-based configuration
- Email confirmation after booking (optional)
- CORS-enabled API access

---

## 🚀 Deployment URL

🔗 **Backend API URL**:  
`http://a97b7d07aa44646d8ac1345569b44e33-509261369.us-east-1.elb.amazonaws.com`

🔗 **MySQL Host**:  
`http://dental-db2.cixqeq0einm3.us-east-1.rds.amazonaws.com`

Example Endpoints:

- `POST /login`
- `POST /register/user`
- `GET /user-appointments`
- `POST /appointments/create`
- `POST /appointments/update`

---

## ⚙️ Local Development Setup

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/dental-scheduler-backend.git
cd dental-scheduler-backend
```
