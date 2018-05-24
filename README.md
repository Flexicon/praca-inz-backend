# Node backend for my Bachelor paper

Used technologies
- [Docker](https://www.docker.com/)
- [Node 9.11.1-alpine](https://hub.docker.com/_/node/)
- [Express web framework](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [mongoose - MongoDB ODM](http://mongoosejs.com/)
- todo...

Running the api
---------------

Intended to be ran on a unix system with access to bash.

Make sure that `manage.sh` has permission to execute before attempting the following commands.

- `manage.sh init` - initializes the project. (builds containers, starts them up, loads the datasets into the databases, etc)
- `manage.sh start` - starts previously initialized containers
- `manage.sh stop` - stops containers
- `manage.sh clean` - removes containers as well as the persistent data volumes
- `manage.sh chown` - fixes file ownership and permissions within the containers if something goes wrong
- `manage.sh database seed-data` - manually prepopulates the databases with seeds (this is launched automatically as part of `manage.sh init`)
