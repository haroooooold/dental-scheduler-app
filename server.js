const express = require("express");
const db = require("./db");
const app = express();
const PORT = 3000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

app.use(express.json());

app.get("/user-appointments", async (req, res) => {
  const userName = req.query.userName;

  try {
    let query = "SELECT * FROM user_appointments";
    let params = [];

    if (userName) {
      query += " WHERE full_name = ?";
      params.push(userName);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching user appointments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const users = [
  {
    id: 1,
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 8), // hashed password
  },
];

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", {
    expiresIn: "1h",
  });

  res.json({ token });
});

app.post("/register/user", async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res.status(400).json({
      error:
        "Missing required fields: firstName, lastName, email, password, phoneNumber",
    });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);

    const [results] = await db.query(
      `CALL register_user(?, ?, ?, ?, ?, @response)`,
      [firstName, lastName, email, hashedPassword, phoneNumber]
    );

    const [[response]] = await db.query(`SELECT @response AS message`);
    const parsed = JSON.parse(response.message);

    res.status(parsed.responseCode).json(parsed);
  } catch (err) {
    res.status(500).json({
      error: "Internal server error while registering user",
    });
  }
});

app.post("/appointments/create", async (req, res) => {
  const { userName, dentistName, appointmentDate } = req.body;

  if (!userName || !dentistName || !appointmentDate) {
    return res.status(400).json({
      error: "Missing required fields: userName, dentistName, appointmentDate",
    });
  }

  try {
    const [results] = await db.query(
      `CALL manage_appointment(?, ?, ?, @response)`,
      [userName, dentistName, appointmentDate]
    );

    const [[response]] = await db.query(`SELECT @response AS message`);
    const parsed = JSON.parse(response.message);

    res.status(parsed.responseCode).json(parsed);
  } catch (err) {
    res.status(500).json({
      error: "Internal server error while creating appointment",
    });
  }
});

app.post("/appointments/update", async (req, res) => {
  const { referenceId, dentistName, appointmentDate, status } = req.body;

  if (!referenceId || !dentistName || !appointmentDate || !status) {
    return res.status(400).json({
      error:
        "Missing required fields: referenceId, dentistName, appointmentDate, status",
    });
  }

  try {
    const [results] = await db.query(
      `CALL update_appointment(?, ?, ?, ?, @response)`,
      [referenceId, dentistName, appointmentDate, status]
    );

    const [[response]] = await db.query(`SELECT @response AS message`);
    const parsed = JSON.parse(response.message);

    res.status(parsed.responseCode).json(parsed);
  } catch (err) {
    res.status(500).json({
      error: "Internal server error while updating appointment",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
