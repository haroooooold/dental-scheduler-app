const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("admin123", 8);
console.log("Hashed password:", hash);
