const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  primaryColor: { type: String, required: true },
  secondaryColor: { type: String, required: true },
  logoUrl: { type: String, required: true },
  logo: { type: String, require: true },
  products: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
});
const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
