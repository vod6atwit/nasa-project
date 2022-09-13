# **_nasa-project_**

![]()

<br><br>

### **Introduction**

nasa project is a full-stack web application used to launch spaceX rocket to the Kepler habitable Planets

Live application hosted on AWS EC2 instances, deploy using Docker image <a href="http://3.95.188.251:8000/" target="_blank">nasa project</a>

### **Features:**

- Able to launch a rocket to Kepler Habitable Planets via control center
- Able to see upcoming launch with date, mission, rocket and destination
- Able to aborts the mission
- Able to see history after aborting the mission or successful launch
- Get real upcoming and history launch of spaceX company by implemented call rest API
  Source: <a href="https://github.com/r-spacex/SpaceX-API" >https://github.com/r-spacex/SpaceX-API</a>
- Fitler out several Habitable Planets in kepler\*data_csv
  - Implemented MVC pattern
- Implemented PM2, Docker and EC2 instances
- Implemented Github Workflow using yml file
- Implemented testing using SuperTest library and JEST

<br>

### **Architecture:**

<br>

**Project structure:**

```
.github/
├── workflows
│   ├── node.yml
client/ (provided by frontend devs)
server/
├── date
│   ├── kepler_data_csv
├── public (build and import from frontend)
├── src
│   ├── models
│   │   └── launchesModel.js
│   │   └── launchesMongo.js
│   │   └── PlanetssModel.js
│   │   └── PlanetssMongo.js
│   ├── routes
│   │   ├── launches
│   │   │   └── launches.test.js (for JEST testing)
│   │   │   └── launchesController.js
│   │   │   └── launchesRouter.js
│   │   ├── planets
│   │   │   └── planetsController.js
│   │   │   └── planetsRouter.js
│   │   ├── api.js (easy to create multiple version of API later)
│   ├── services
│   │   └── mongo.js
│   │   ├── query.js
│   └── app.js
│   ├── server.js
├── package.json
.dockerignore
.gitignore
Dockerfile
package.json
readme.md
```

<br><br>

**MVC architecture:**

The MVC architecture used here, is a way to structure the application development in three layers:

- <ins>Business logic layer:</ins> represented in Model folder, with mongoose schema choosing which information and data
  represnting to clients and is the layer that the hole application build around.
- <ins>Application logic layer:</ins> represented in Controler files, build around javascript functions to handle application's requests interact with models and send back response to clients.
- <ins>Presentation logic layer:</ins> represented in public folder consists basically of the templates used to generate the view, so the website that we're going to send back to the clients.

<br>

- Implemented ECS and docker for better security
- Implemented pagination for history page

<br><br>
