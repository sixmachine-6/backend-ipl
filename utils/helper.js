const Team = require("../models/teamModel");
module.exports = async () => {
  const teams = await Team.find();
  console.log(teams);
  return teams[Math.floor(Math.random() * teams.length)].id;
};
