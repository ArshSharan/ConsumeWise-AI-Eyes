import mongoose from 'mongoose';
import logger from "../logs/logger.js"


const connectDB = () => mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch(error => {
    console.log(error);
    logger.error(error);
  });

export default connectDB;
