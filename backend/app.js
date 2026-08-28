const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

/** @type {import('express').Express} */
const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;