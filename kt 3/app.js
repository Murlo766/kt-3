const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.set('view engine', 'ejs');

let user = { id: 1, email: 'user@example.com' };

app.get('/', (req, res) => {
  res.render('profile', { email: user.email, csrfToken: req.csrfToken() });
});

app.post('/update-email', (req, res) => {
  user.email = req.body.email;
  res.redirect('/');
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Invalid CSRF token');
  }
  next(err);
});

app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));