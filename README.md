# Express-Backend Database

Express backend database server in sqlite3 for crowd-sourced session locations app. See the project Devpost [here](https://devpost.com/software/studybuddy-vmk5xi).

**NOTE**: The repository for the frontend is missing from the "Cruzhacks2024" organization because the repository is owned by another group member who is the only one who can add it, and they have been quite busy since the hackathon... In any case, the frontend repository is located [here](https://github.com/groverneil/CruzHacks24).

Getting started reference: https://itnext.io/lets-dockerize-a-nodejs-express-api-22700b4105e4

Kubernetes was used at some point to create a _stateful_ instance of the database hosted in Google Cloud, but that ended up being quite difficult to set up and **cost $$$**, and was therefore discontinued. As such, the database is _stateless_ at present, meaning that any restart of the database (prompted by a new push to this repository, etc) will **reset it** to its initial state (as given by `database/*.json`).

 This database was tested extensively using [Postman](https://www.postman.com/api-platform/api-testing/). 

## Setup

To build the server image, run

```sh
$ docker-compose build
```

To launch the server listening on port 3000, run

```sh
$ docker-compose up -d
```

To stop the server

```sh
$ docker-compose down
```

Connect to the server via `http://localhost:3000`.

This server is currently being hosted using [Google Cloud Run](https://cloud.google.com/run/docs) and can be accessed using [this link](https://express-backend-wfpd6kozoq-wl.a.run.app).

## [REST](https://restfulapi.net/) API reference

This server accepts and responds to HTTP requests as follows:

- `GET /locations` - This returns a JSON-formatted array of objects that each provide details for each location with the location name, description, and then it's longitude and latitude.
  Response:

  ```javascript
  [
    {
      name: string,
      description: string,
      long: float,
      lat: float,
    },
  ];
  ```

  Returns 200 upon success, or 500 upon failure.

- `GET /locations/<id>` - This returns a JSON-formatted array of objects that each provide details for the sessions at the location with the `id` given. Each session currently has a title and a description (if applicable).
  Response:

  ```javascript
  [
    {
      title: string,
      description: string | null,
    },
  ];
  ```

  Returns 200 upon success, or 500 upon failure.

- `PUT /locations` - This inserts a new location into the locations table. The request body must be JSON-formatted as follows:

  ```javascript
    {
      name: string,
      description: string,
      long: float,
      lat: float
    }
  ```

  Returns 201 upon success, 400 for an ill-formatted request body, or 500 for other errors.

- `PUT /locations/<id>` - This inserts a new session into the sessions table at the location given by `id`. The request body must be json-formatted as follows:

  ```javascript
    {
      title: string,
      description: string | null
    }
  ```

  Returns 201 upon success, 400 for an ill-formatted request body, or 500 for other errors.

- `DELETE /locations/<id>` - This deletes a location with the given `id`. The response code is 200 upon success, or 500 upon failure.

- `DELETE /locations/<locID>/<sessID>` - This deletes a session with the given `sessID` at the location given by `locID`. The response code is 200 upon success, or 500 upon failure.
