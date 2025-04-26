const express = require("express");
const db = require("./db");
const app = express();
const PORT = 3000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/user-appointments", async (req, res) => {
  const userName = req.query.userName;

  try {
    let query = "SELECT * FROM user_appointments";
    let params = [];

    if (userName) {
      query += " WHERE email = ?";
      params.push(userName);
    }

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 200,
        data: [],
        message: "No appointments found.",
      });
    }

    res.status(200).json({
      status: 200,
      data: rows,
      message: "Appointments fetched successfully.",
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      data: {
        error_message: "Email and password are required.",
      },
      message: "error",
    });
  }

  try {
    const [rows] = await db.execute(
      `SELECT email, password FROM users_masterlist WHERE email = ? LIMIT 1`,
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        status: 401,
        data: {
          error_message: "Invalid email or password.",
        },
        message: "error",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        data: {
          error_message: "Invalid email or password.",
        },
        message: "error",
      });
    }

    const token = jwt.sign({ email: user.email }, "secretkey", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: 200,
      data: {
        token,
      },
      message: "success",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: 500,
      data: {
        error_message: "Internal server error while logging in",
      },
      message: "error",
    });
  }
});

app.post("/register/user", async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res.status(400).json({
      status: 400,
      data: {
        error_message:
          "Missing required fields: firstName, lastName, email, password, phoneNumber",
      },
      message: "error",
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

    const status = parsed.responseCode || 500;

    return res.status(status).json({
      status: status,
      data: parsed,
      message: parsed.responseMessage,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      data: {
        error_message: "Internal server error while registering user",
      },
      message: "error",
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

    const status = parsed.responseCode || 500;

    return res.status(status).json({
      status: status,
      data: parsed,
      message: parsed.responseMessage,
    });
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

app.get("/available-dentists", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM available_dentists");

    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No available dentists found.",
      });
    }

    res.status(200).json({
      status: 200,
      data: rows,
      message: "Available dentists fetched successfully.",
    });
  } catch (err) {
    console.error("Error fetching available dentists:", err);
    res.status(500).json({
      status: 500,
      message: "Internal server error while fetching dentists.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
