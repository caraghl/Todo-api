var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

// model
var todos = [{
	id: 1,
	description: 'Make lunch',
	completed: false
}, {
	id: 2,
	description: 'Pay bills',
	completed: false
}, {
	id:3,
	description: 'Eat breakfast',
	completed: true
}];

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
	//res.json(todos[req.params.id - 1]);

	// or iterate painfully
	var todoId = parseInt(req.params.id);
	var matchedTodo;


	todos.forEach(function(todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
			console.log('got it');
		}
	});

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