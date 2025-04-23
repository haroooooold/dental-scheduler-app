# Dental Appointment Backend

This is a Node.js backend project for scheduling dental appointments. Built for a technical assessment.

## 🔗 Live API

http://a97b7d07aa44646d8ac1345569b44e33-509261369.us-east-1.elb.amazonaws.com

## 🚀 Tech Stack

- Node.js + Express
- MySQL (Amazon RDS)
- Docker
- Kubernetes (AWS EKS)

## 📦 API Endpoints

### `GET /appointments`

Returns all appointments.

### `POST /appointments`

Creates an appointment.

Example JSON body:

```json
{
  "name": "Jane Doe",
  "date": "2025-04-25 14:30:00"
}
```
