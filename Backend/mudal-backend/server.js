const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Route Files
const budgetRoutes = require('./routes/budgets');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes go here
app.use('/api/budgets', budgetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
