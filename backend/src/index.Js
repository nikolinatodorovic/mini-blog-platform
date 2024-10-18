const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');  
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);

// Pokretanje servera
app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});
