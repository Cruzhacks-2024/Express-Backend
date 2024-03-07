# Express-Backend

Express backend database server in sqlite3 for session mapping app

Getting started reference: https://itnext.io/lets-dockerize-a-nodejs-express-api-22700b4105e4

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

## API reference

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

- `GET /locations/<id>` - This returns a JSON-formatted array of objects that each provide details for the sessions at the location with the `id` given. Each session currently has a title and a room number (if applicable) at the associated location.
  Response:

```javascript
[
  {
    title: string,
    room: int | null,
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
    room: int | null
  }
```

Returns 201 upon success, 400 for an ill-formatted request body, or 500 for other errors.

- `DELETE /locations/<id>` - This deletes a location with the given `id`. The response code is 200 upon success, or 500 upon failure.

- `DELETE /locations/<locID>/<sessID>` - This deletes a session with the given `sessID` at the location given by `locID`. The response code is 200 upon success, or 500 upon failure.
