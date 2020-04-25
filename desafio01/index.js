const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let count = 0;

function checkProjectExists(req, res, next) {
  const project = projects[req.params.id];

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  req.project = project;

  return next();
};

function countRequest(req, res, next) {
  count++;

  console.log(count, 'requests');

  return next();
}

server.post('/projects', countRequest, (req, res) => {
  const project = req.body;

  projects.push(project);

  return res.json(projects);
});

server.get('/projects', countRequest, (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', countRequest, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;

  return res.json(projects);
});

server.delete('/projects/:id', countRequest, checkProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(id , 1);

  return res.send();
});

server.post('/projects/:id/tasks', countRequest, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  return res.json(projects);
});

server.listen(3000);