const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI || !process.env.MONGO_URI.trim()) {
    console.error('MONGO_URI is missing. Set it in Backend/mudal-backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI.trim());
    console.log('MongoDB connected');
  } catch (err) {
    const msg = err.message || String(err);
    console.error('MongoDB connection failed:', msg);
    if (/auth|bad auth|Authentication failed/i.test(msg)) {
      console.error(
        '→ Usually: wrong DB username/password in MONGO_URI, or password needs URL-encoding (@ # : / ? etc.).\n' +
          '→ In Atlas: Database Access → user → Edit → reset password, then paste the new password into the URI.\n' +
          '→ Format: mongodb+srv://USER:PASSWORD@cluster.../DATABASE?retryWrites=true&w=majority'
      );
    }
    process.exit(1);
  }
};

module.exports = connectDB;
