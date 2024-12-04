const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Team = require("./../models/teamModel");

dotenv.config({ path: "./../config.env" });

const DB = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);
console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection succesful"))
  .catch((err) => console.log(err.message));

const teams = JSON.parse(fs.readFileSync(`${__dirname}/teams.json`, "utf-8"));

console.log(teams);
const importData = async () => {
  try {
    await Team.create(teams);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Team.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
