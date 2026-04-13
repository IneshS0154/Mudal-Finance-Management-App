# 💰 MUDAL - Finance Management App

A comprehensive mobile finance management application built with React Native and Node.js. MUDAL helps users track income, expenses, set budgets, and achieve savings goals with an intuitive and engaging interface.

---

## 🎯 Features

### 1. 👤 **Users**
Secure authentication and profile management
- User registration and login
- Profile updates (name, currency preference)
- Password management and change
- Account deletion

### 2. 💸 **Transactions**
Complete transaction management system (Core feature)
- Create income and expense entries
- Advanced filtering (date range, type, category)
- Update transaction details
- Delete transactions
- Real-time transaction history

### 3. 🏷️ **Categories**
Flexible category system
- Preset categories
- Create custom categories (name, icon, color, type)
- Read all user categories
- Update category details
- Smart deletion (prevents deletion if transactions reference it)

### 4. 📊 **Budgets**
Monthly budget tracking and control
- Set budget limits per category per month
- View current month's budgets
- Live spending calculation against budget
- Update budget limits
- Delete budgets

### 5. 🔁 **Recurring Transactions**
Automated recurring payment management
- Create recurring templates (amount, category, frequency, start date)
- View all active recurring transactions
- Update schedule and frequency
- Cancel or delete recurring templates

### 6. 🎯 **Savings Goals**
Goal tracking and progress monitoring
- Create savings goals (name, target amount, deadline)
- View all goals with progress percentage
- Log contributions toward goals
- Update or delete goals
- Track progress toward targets

---

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development and deployment platform
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Nodemon** - Development server with auto-reload

---

## 📁 Project Structure

```
Mudal/
├── App/
│   └── mudal/                    # React Native/Expo frontend
│       ├── src/
│       │   ├── api/
│       │   │   └── client.js     # Axios API configuration
│       │   ├── screens/
│       │   ├── components/
│       │   └── ...
│       ├── App.js
│       ├── app.json              # Expo configuration
│       ├── index.js
│       └── package.json
│
└── Backend/
    └── mudal-backend/            # Node.js/Express backend
        ├── config/
        │   └── db.js             # MongoDB connection
        ├── controllers/          # Business logic
        ├── middleware/
        │   └── auth.js           # JWT authentication
        ├── models/               # Mongoose schemas
        ├── routes/               # API endpoints
        ├── uploads/              # File storage
        ├── server.js
        ├── .env                  # Environment variables
        └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- MongoDB Atlas account (for cloud database)
- iOS Simulator or Android Emulator (optional, for mobile testing)

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd Backend/mudal-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env`):
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mudal?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to app folder:**
   ```bash
   cd App/mudal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Expo development server:**
   ```bash
   npm run start
   ```

4. **Connect to device:**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo app on physical device

---

## 📡 API Endpoints

### Users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete account

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions (with filters)
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `POST /api/categories` - Create category
- `GET /api/categories` - Get all categories
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - Get current month budgets
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Recurring Transactions
- `POST /api/recurring` - Create recurring transaction
- `GET /api/recurring` - Get all active recurring
- `PUT /api/recurring/:id` - Update recurring
- `DELETE /api/recurring/:id` - Delete recurring

### Savings Goals
- `POST /api/goals` - Create goal
- `GET /api/goals` - Get all goals
- `POST /api/goals/:id/contribute` - Add contribution
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

---

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Development Notes

- **Database**: MongoDB Atlas (cloud hosted)
- **Authentication**: JWT-based with secure middleware
- **API Base URL**: Configured in `App/mudal/src/api/client.js`
- **Environment**: Use `.env` files for sensitive configuration

---

## 🐛 Troubleshooting

### Backend Connection Issues
- Verify MongoDB connection string in `.env`
- Ensure PORT variable is correctly named (not `ORT`)
- Check that MongoDB Atlas network access allows your IP

### Expo Simulator Connection Issues
- Run `npx expo start --clear` to reset
- Try `npx expo start --localhost` for local simulator testing
- Verify firewall allows connections on port 8081

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.x",
  "mongoose": "^7.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "cors": "^2.x",
  "dotenv": "^16.x"
}
```

### Frontend
```json
{
  "react-native": "^0.x",
  "expo": "^49.x",
  "axios": "^1.x",
  "react-navigation": "^6.x"
}
```

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Created with ❤️ for personal finance management

---

**Happy tracking! 💪**
