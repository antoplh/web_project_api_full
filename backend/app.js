const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // <--- Importa el paquete CORS
const auth = require('./middleware/auth'); // Ensure this is middleware
const { createUser, loginUser } = require('./controllers/users');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();

app.use(bodyParser.json());

app.use(cors());
// app.use(cors({ origin: "https://antonella-around.chickenkiller.com" }));

app.use(requestLogger);

// Public routes
app.post('/signin', loginUser); // Ensure `auth` is a middleware
app.post('/signup', createUser);

// Protected routes
const userRoutes = require('./routes/users');
app.use('/users', auth, userRoutes);

app.use(errorLogger);

// MongoDB connection with error handling
mongoose
  .connect('mongodb://127.0.0.1:27017/aroundbfull', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
