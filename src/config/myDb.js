import mongoose from "mongoose";

export async function handleConectionDb() {
  mongoose.connect(process.env.DB_CONNECTION_STRING);

  return mongoose.connection;
}
