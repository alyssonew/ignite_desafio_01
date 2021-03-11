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

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(200).json(user)

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

   return response.status(200).json(newTodo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post("/teste", (req, res) => {
  console.log(req.body)
})
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;