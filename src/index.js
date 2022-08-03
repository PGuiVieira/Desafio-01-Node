const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  const userAlreadyExists = users.find( (user) => user.username === username );

  if (!userAlreadyExists){
    return response.status(404).json({error: "User not exist"});
  }

 request.user = userAlreadyExists;
  
 return next();
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;
  
  const userAlreadyExists = users.some( (user) => user.username === username );

  if (userAlreadyExists){
    return response.status(400).json({error: "Mensagem do erro"});
  }
  users.push({
    id:uuidv4(),
    name,
    username,
    todos:[]
  });

  const userCreated = users.find((user) => user.username === username );

  return response.status(201).json(userCreated);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
 const {title,deadline} = request.body;
 const {user} = request;

 user.todos.push({
   id: uuidv4(),
   title,
   done:false,
   deadline: new Date(deadline),
   created_at: new Date()
 })
 const lastTodoUser = user.todos.length - 1;

return response.status(201).json(user.todos[lastTodoUser])

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {title,deadline} = request.body;
  const {user} = request;
  const {id} = request.query;

  const todoUpdate = user.todos.find((todo) => todo.id === id);
  todoUpdate.deadline = deadline;
  todoUpdate.title = title;

  return response.json(todoUpdate)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;