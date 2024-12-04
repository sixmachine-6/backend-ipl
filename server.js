const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: `./config.env` });

const DB = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection succesful"))
  .catch((err) => console.log(err.message));

app.listen(5000, "127.0.0.1", () => console.log("app is running"));
