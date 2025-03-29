const express = require('express');
const cors = require('cors');
const path = require('path');

// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// const userRoutes = require('./routes/userRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);

// app.use('/api/admin', adminRoutes);
// app.use('/api', userRoutes);

// const PORT = 8000 || 8001;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://magadha.onrender.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use(express.static(path.join(__dirname, "client", "dist")));


app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
