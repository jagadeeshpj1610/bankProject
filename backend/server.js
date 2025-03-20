const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);

const PORT = 8000 || 8001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



