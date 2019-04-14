'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const controller = require('./controller.js');

const app = express();

const DATABASE = process.env.DATABASE;
mongoose.connect(DATABASE, {useNewUrlParser: true});

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));

app.post('/api/shorturl/new', controller.shortenUrl);
app.get('/api/shorturl/:shurl', controller.redirectFromShortToOriginalUrl);

app.use((req, res) => res.status(404).send('Something went wrong...'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Node.js listening ...'));