var express = require('express');
var path = require('path');
var app = express();
var days = require('./helpers/days');

app.set('view engine', 'jade');
app.use(express.static('dist'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Sprint Planner'});
});

app.get('/api/settings', function (req, res) {
  var settings = [
  	{
  		name: 'Number of weeks',
  		options: [
  			{
  				value: 1,
  				name: '1'
  			},
  			{
  				value: 2,
  				name: '2'
  			},
  			{
  				value: 3,
  				name: '3'
  			},
  			{
  				value: 4,
  				name: '4'
  			}
  		]
  	},
  	{
  		name: 'Number of work days',
  		options: [
  			{
  				name: '4',
  				value: 4
  			},
  			{
  				name: '5',
  				value: 5
  			},
  			{
  				name: '6',
  				value: 6
  			},
  			{
  				name: '7',
  				value: 7
  			}
  		]
  	},
  	{
  		name: 'Start day',
  		method: 'startDay',
  		options: days.map(function(day) {
  			return {
  				name: day.name,
  				value: day.name.toLowerCase(),
  				selected: (day.name === 'Monday') ? true : false
  			}
  		}),
  		selected: 'Monday'
  	},
  	{
  		name: 'End day',
  		method: 'endDay',
  		options: days.map(function(day) {
  			return {
  				name: day.name,
  				value: day.name.toLowerCase(),
  				selected: (day.name === 'Friday') ? true : false
  			}
  		}),
  	}
  ]

  res.send(settings);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
