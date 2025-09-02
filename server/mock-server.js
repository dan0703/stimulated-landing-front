const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/test-endpoint', (req, res) => {
  res.json({
    message: 'This is mock data from the local API',
    timestamp: Date.now(),
    items: [
      { id: 1, name: 'Item A' },
      { id: 2, name: 'Item B' }
    ]
  });
});

app.get('/', (req, res) => res.send('Mock API running'));

app.listen(port, () => {
  console.log(`Mock API listening at http://localhost:${port}`);
});
