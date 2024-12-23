/* eslint-disable no-console */
'use strict';

const express = require('express');
const cors = require('cors');
const ids = (users) => users.length + 1;

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const expenses = [];
  const users = [];

  app.get('/expenses', (req, res) => {
    console.log('Req: Users:', users);

    res.status(200).json(expenses);
  });

  app.get('/expenses/:id', (req, res) => {
    const { id } = req.params;

    const expensesId = expenses.find((exp) => exp.userId === parseInt(id, 10));

    console.log(expensesId, id);

    if (!expensesId || !id) {
      return res.status(404).json({ message: 'Expenses not found' });
    }

    res.status(200).json(expensesId);
  });

  app.post('/expenses', (req, res) => {
    const { userId } = req.body;

    const newPost = { ...req.body, id: ids(expenses) };
    const userExists = users.some((user) => user.id === userId);

    if (Object.keys(req.body).length === 0 || !userExists) {
      return res.status(400).end();
    }

    expenses.push(newPost);

    return res.status(201).json(newPost);
  });

  app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;

    const expensesIndex = expenses.findIndex((exp) => exp.id === parseInt(id));

    if (expensesIndex === -1) {
      return res.status(404).json('Not Found');
    }

    expenses.splice(expensesIndex, 1);
    res.status(204).json('No Content');
  });

  app.get('/users', (req, res) => {
    res.status(200).json(res.req);
  });

  app.post('/users', (req, res) => {
    const newUser = { ...req.body, id: ids(users) };

    if (Object.keys(req.body).length === 0) {
      return res.status(400).end();
    }

    users.push(newUser);

    return res.status(201).json(newUser);
  });

  app.get('/user/:id', (req, res) => {
    const { id } = req.params;

    const isUser = users.find((user) => user.id === parseInt(id));

    if (!isUser) {
      return res.status(404);
    }

    res.status(200).json(isUser);
  });

  return app;
}

module.exports = {
  createServer,
};
