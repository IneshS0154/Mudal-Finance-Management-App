const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { startScheduler } = require('./services/recurringScheduler');

const recurringRoutes = require('./routes/recurring');


dotenv.config();
connectDB().then(() => {
  // Start the recurring transaction scheduler after DB is ready
  startScheduler();
});

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recurring', recurringRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));