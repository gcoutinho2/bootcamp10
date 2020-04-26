const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params.id;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
};

function countRequests(req, res, next) {
  console.count('requests');

  return next();
}

server.use(countRequests);

server.post('/projects', (req, res) => {
  const {id, title} = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex , 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);