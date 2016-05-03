var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

// express will parse all json requests that come in
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res) {
	// converts the model object to a JSON and sends back to caller of API
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	console.log('Asking for todo with id of ' + req.params.id);
	var todoId = parseInt(req.params.id, 10);
   	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		console.log('found a match');
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});


// POST /todos
app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');

	// validation
	if(!_.isString(body.description) || !_.isBoolean(body.completed) ) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	// only increments after the assignment
	body.id = todoNextId++;

	todos.push(body);

	console.log(todos);

	res.json(todos);
});

/// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
 	var todoId = parseInt(req.params.id, 10);
   	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		console.log('found a match');
		todos = _.without(todos, matchedTodo);
	} else {
		res.status(404).send();
	}
	res.json(todos);
	console.log(todos);

});

// PUT /todos/:id
app.put('/todos/:id' , function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if(!matchedTodo) {
		return res.status(404).send();
	}

	// validation
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')) {
		// bad
		return res.status(400).send();
	} else {
		// never provided attribute, no problem here
	}
 
 	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')) {
		// bad
		return res.status(400).send();
	} 


	_.extend(matchedTodo, validAttributes);
	
	console.log(matchedTodo);
	res.json(todos);

});

