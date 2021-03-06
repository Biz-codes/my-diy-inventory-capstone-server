const path = require("path");
const express = require("express");
const xss = require("xss");
const ProjectsService = require("./projects-service");

const projectsRouter = express.Router();
const jsonParser = express.json();

const serializeProject = (project) => ({
  id: project.id,
  user_id: project.user_id,
  project_name: xss(project.project_name),
  supplies_needed: xss(project.supplies_needed),
  tools_needed: xss(project.tools_needed),
  instructions: xss(project.instructions),
  delivery_date: project.delivery_date,
  done: project.done,
});

projectsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ProjectsService.getAllProjects(knexInstance)
      .then((projects) => {
        res.json(projects.map(serializeProject));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const {
      user_id,
      project_name,
      supplies_needed,
      tools_needed,
      instructions,
      delivery_date,
      done,
    } = req.body;

    const newProject = {
      user_id,
      project_name,
      supplies_needed,
      tools_needed,
      instructions,
      delivery_date,
      done,
    };

    for (const [key, value] of Object.entries(newProject))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    ProjectsService.insertProject(req.app.get("db"), newProject)
      .then((project) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${project.id}`))
          .json(serializeProject(project));
      })
      .catch(next);
  });

projectsRouter.route("/my-projects/:user_id").all((req, res, next) => {
  if (isNaN(parseInt(req.params.user_id))) {
    return res.status(404).json({
      error: {
        message: `Invalid id`,
      },
    });
  }
  ProjectsService.getProjectsByUserId(req.app.get("db"), req.params.user_id)
    .then((projects) => {
      res.json(projects.map(serializeProject));
    })
    .catch(next);
});

projectsRouter
  .route("/:project_id")
  .all((req, res, next) => {
    ProjectsService.getById(req.app.get("db"), req.params.project_id)
      .then((project) => {
        if (!project) {
          return res.status(404).json({
            error: { message: `Project doesn't exist` },
          });
        }
        res.project = project;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeProject(res.project));
  })
  .delete((req, res, next) => {
    ProjectsService.deleteProject(req.app.get("db"), req.params.project_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const {
      user_id,
      project_name,
      supplies_needed,
      tools_needed,
      instructions,
      delivery_date,
      done,
    } = req.body;
    const projectToUpdate = {
      user_id,
      project_name,
      supplies_needed,
      tools_needed,
      instructions,
      delivery_date,
      done,
    };

    const numberOfValues =
      Object.values(projectToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'project_name', 'supplies_needed', 'tools_needed', 'instructions', 'delivery_date', or 'done'.`,
        },
      });

    ProjectsService.updateProject(
      req.app.get("db"),
      req.params.project_id,
      projectToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = projectsRouter;
