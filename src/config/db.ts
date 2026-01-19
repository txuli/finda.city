import mongoose from "mongoose"

const connection = mongoose.connect(process.env.DB_CONNECTION || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

export default connection 