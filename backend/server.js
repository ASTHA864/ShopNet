require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes')
const productRoutes= require('./src/routes/productRoutes')
const PORT = process.env.PORT || 3000;

connectDB();
// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true}))

// User Routes
app.use('/api/auth',authRoutes)
// Product Route
app.use('/api/products',productRoutes)
// Order Route
// app.use("/api/orders",ordersRoutes);
// Payment Route
// app.use("/api/payment", paymentRoutes);
// Analytics Route
// app.use("/api/analytics", analyticsRoutes);

// Test Route
app.get('/',(req,res)=> {
  res.send("Test Route Home")
})
app.listen(PORT, () => {
  console.log("Server is running on port:3000");
});