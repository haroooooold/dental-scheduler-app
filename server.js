const express = require("express");
const db = require("./db");
const app = express();
const PORT = 3000;

app.use(express.json());

// Test route to insert an appointment
app.post("/appointments", async (req, res) => {
  const { name, date } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO appointments (name, date) VALUES (?, ?)",
      [name, date]
    );
    res.json({ success: true, insertedId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route to get appointments
app.get("/appointments", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM appointments");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
