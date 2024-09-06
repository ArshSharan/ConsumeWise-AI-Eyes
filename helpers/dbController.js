import mongooose from "mongoose";

export function connectDB() {
  mongooose.connect(process.env.DB_URL);
  const connection = mongooose.connection;
  connection.once("open", () => {
    console.log("Database connected");
  });
}
