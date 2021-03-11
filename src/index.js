const express = require('express');
const cors = require('cors');


const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json())

app.use(cors());


const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
 
  const user = users.find(user => user.username === username)

  if (!user){
    return response.status(404).json({
      error: "User not found"
    })
  }

  request.user = user;

  return next()

}

app.post('/users', (request, response) => {

  const {name, username } = request.body;

  const userAlreadyExists = users.find((user) => user.username === username)
  if (userAlreadyExists){
    return response.status(400).json({
      error: 'User already exists'
    })
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;


  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
   user.todos.push(newTodo)

   return response.status(201).json(newTodo)

});

function getTodoToUpdate(user, id){
  const todo = user.todos.find((todo) => todo.id === id)
  return todo
}

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = getTodoToUpdate(user, id);
  
  if (!todo){
    return response.status(404).json({
      error: "Todo does not exists"
    })
  }

  todo.title = title,
  todo.deadline= deadline;

  return response.status(201).json(todo);


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoToPatch = getTodoToUpdate(user, id);

  if (!todoToPatch){
    return response.status(404).json({
      error: "Todo does not exists"
    })
  }
  
  todoToPatch.done = true;

  return response.status(201).json(todoToPatch)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { id } = request.params;

  const todoToDelete = getTodoToUpdate(user, id)

  if (!todoToDelete){
    return response.status(404).json({
      error: "Todo does not exists"
    })
  }

  user.todos.splice(todoToDelete, 1)

  return response.status(204).send(user)

});

module.exports = app;