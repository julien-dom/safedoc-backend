require("dotenv").config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('./models/connection');

var confidentialitiesRouter = require('./routes/confidentialities');
var doctorsRouter = require('./routes/doctors');
var gendersRouter = require('./routes/genders');
var languagesRouter = require('./routes/languages');
var orientationsRouter = require('./routes/orientations');
var recommandationsRouter = require('./routes/recommendations');
var sectorsRouter = require('./routes/sectors');
var specialtiesRouter = require('./routes/specialties');
var tagsRouter = require('./routes/tags');
var usersRouter = require('./routes/users');

var app = express();
//  module CORS afin que notre webservice puisse être joint par une application JS.
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/confidentialities', confidentialitiesRouter);
app.use('/doctors', doctorsRouter);
app.use('/genders', gendersRouter);
app.use('/languages', languagesRouter);
app.use('/orientations', orientationsRouter);
app.use('/recommandations', recommandationsRouter);
app.use('/sectors', sectorsRouter);
app.use('/specialties', specialtiesRouter);
app.use('/tags', tagsRouter);
app.use('/users', usersRouter);

module.exports = app;
