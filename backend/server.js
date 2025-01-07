const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/admin', adminRoutes);

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});