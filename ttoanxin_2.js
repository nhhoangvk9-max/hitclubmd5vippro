const express = require('express');
const { predict } = require('./predictor');

const app = express();
app.use(express.json());

// Endpoint GET: /predict?results=T,X,T,X...
app.get('/predict', (req, res) => {
  const { results } = req.query;
  if (!results) {
    return res.status(400).json({ error: 'Thiếu tham số results, ví dụ: ?results=T,X,T,T,X' });
  }

  const history = results.split(',').map(s => s.trim().toLowerCase()).filter(s => s === 't' || s === 'x');
  if (history.length < 5) {
    return res.status(400).json({ error: 'Cần ít nhất 5 kết quả để phân tích' });
  }

  const prediction = predict(history);
  res.json(prediction);
});

// Endpoint POST với body JSON
app.post('/predict', (req, res) => {
  const { results } = req.body;
  if (!Array.isArray(results) || results.length < 5) {
    return res.status(400).json({ error: 'Body cần mảng results ít nhất 5 phần tử (t/x)' });
  }
  const history = results.map(s => s.toLowerCase()).filter(s => s === 't' || s === 'x');
  const prediction = predict(history);
  res.json(prediction);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ hitclub API đang chạy tại cổng ${PORT}`);
});