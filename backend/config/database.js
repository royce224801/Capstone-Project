const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://roycerojar_db_user:roycerojar@employee.xrp6suq.mongodb.net/mindscribble?retryWrites=true&w=majority&appName=Employee');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;