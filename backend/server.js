const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes'); // Import checkout routes
const orderRoutes = require('./routes/orderRoutes'); // Import order routes
const uploadRoutes = require('./routes/uploadRoutes'); // Import upload routes
const SubscriberRoutes = require('./routes/subscriberRoutes'); // Import Subscriber model
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const productAdminRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config(); // Load environment variables before usage

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes); // Use checkout routes
app.use('/api/orders', orderRoutes); // Use order routes
app.use('/api/upload', uploadRoutes); // Use upload routes
app.use('/api/subscribe', SubscriberRoutes); // Use subscriber routes

//Admin 
app.use('/api/admin/users', adminRoutes); // Use admin routes
app.use('/api/admin/products', productAdminRoutes); // Use product admin routes
app.use('/api/admin/orders', adminOrderRoutes); // Use admin order routes

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
