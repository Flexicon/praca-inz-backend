#!/bin/bash

OS=`uname`

COLOR_RED='\033[0;31m' #Red color
COLOR_GREEN='\033[0;32m' #Red color
COLOR_NO_COLOR='\033[0m' # No Color
COLOR_YELLOW='\e[93m' #Light yellow color
COLOR_BLUE='\e[34m' #Blue color

FONT_BOLD=$(tput bold)
FONT_NORMAL=$(tput sgr0)
FONT_UNDERLINE='\e[4m'

ENVIRONMENT_DEV='DEV'
ENVIRONMENT_PROD='PROD'

function start_containers(){

    if [[ $1 == 'prod' ]]; then
        ENVIRONMENT=$ENVIRONMENT_PROD
        echo -e "Starting the containers in the ${COLOR_RED}${ENVIRONMENT}${COLOR_NO_COLOR} environment."

        docker-compose up -d

        CONTAINER_ID_EXPRESS=`docker-compose ps -q express`
        docker exec -d $CONTAINER_ID_EXPRESS npm start
    else
        ENVIRONMENT=$ENVIRONMENT_DEV
        echo -e "Starting the containers in the ${COLOR_GREEN}${ENVIRONMENT}${COLOR_NO_COLOR} environment."

        docker-compose up -d

        CONTAINER_ID_EXPRESS=`docker-compose ps -q express`
        docker exec -d $CONTAINER_ID_EXPRESS nodemon
    fi

}

function update_permissions(){
    docker-compose exec --privileged --user=root express chown -R $UID:$GID *
    docker-compose exec --privileged --user=root express find . -type d -exec chmod 775 {} \;
    docker-compose exec --privileged --user=root express find . -type f -name \*.* -exec chmod 664 {} \;
    docker-compose exec --privileged --user=root express find . -type f -name \*.sh -exec chmod 775 {} \;
}

if [[ $1 == 'start' ]]; then
    start_containers "${@:2}"

elif [[ $1 == 'stop' ]]; then
    docker-compose stop

elif [[ $1 == 'chown' ]]; then
     update_permissions

elif [[ $1 == 'init' ]]; then
    docker-compose build
    docker-compose up -d

    # install dependencies
    echo -e "${COLOR_YELLOW}Installing NPM dependencies${COLOR_NO_COLOR}"
    CONTAINER_ID_EXPRESS=`docker-compose ps -q express`
    docker exec -d $CONTAINER_ID_EXPRESS npm install

    start_containers $2

    # seed the db
    echo -e "${COLOR_YELLOW}Seeding databases${COLOR_NO_COLOR}"
    ./manage.sh database seed-data

    # fix file permissions
    echo -e "${COLOR_YELLOW}Setting file permissions${COLOR_NO_COLOR}"
    ./manage.sh chown

elif [[ $1 == 'clean' ]]; then
    ./manage.sh stop
    docker-compose down --remove-orphans
    docker volume rm backend_mongo_data
    docker volume rm backend_couch_data

elif [[ $1 == 'database' && $2 == 'seed-data' ]]; then
    CONTAINER_ID_EXPRESS=`docker-compose ps -q express`
    CONTAINER_ID_MONGODB=`docker-compose ps -q mongodb`
    CONTAINER_ID_COUCHDB=`docker-compose ps -q couchdb`

    ## MongoDB
    # copy seed files to the container
   echo -e "${COLOR_YELLOW}MongoDB${COLOR_NO_COLOR}"
   docker exec $CONTAINER_ID_MONGODB mkdir /seeds
   docker cp ./seeds/movies.csv $CONTAINER_ID_MONGODB:/seeds/
   docker cp ./seeds/ratings.csv $CONTAINER_ID_MONGODB:/seeds/
   docker cp ./seeds/tags.csv $CONTAINER_ID_MONGODB:/seeds/
    # load data into database
   echo -e "${COLOR_YELLOW}Creating movies database for mongo...${COLOR_NO_COLOR}"
   docker exec $CONTAINER_ID_MONGODB mongoimport --db praca_inz --type csv --headerline --file /seeds/movies.csv
   echo -e "${COLOR_YELLOW}Creating ratings database for mongo...${COLOR_NO_COLOR}"
   docker exec $CONTAINER_ID_MONGODB mongoimport --db praca_inz --type csv --headerline --file /seeds/ratings.csv
   echo -e "${COLOR_YELLOW}Creating tags database for mongo...${COLOR_NO_COLOR}"
   docker exec $CONTAINER_ID_MONGODB mongoimport --db praca_inz --type csv --headerline --file /seeds/tags.csv
    # load setup scripts
   docker cp ./scripts/mongo-setup-indexes.js $CONTAINER_ID_MONGODB:/seeds/
   docker exec $CONTAINER_ID_MONGODB mongo /seeds/mongo-setup-indexes.js
    # remove the files after
   docker exec $CONTAINER_ID_MONGODB rm -rf /seeds

    ## CouchDB
    # create the databases
    echo -e "${COLOR_YELLOW}CouchDB${COLOR_NO_COLOR}"
    echo -e "${COLOR_YELLOW}Creating databases for couch...${COLOR_NO_COLOR}"
    docker exec $CONTAINER_ID_COUCHDB curl -X PUT http://127.0.0.1:5984/movies
    docker exec $CONTAINER_ID_COUCHDB curl -X PUT http://127.0.0.1:5984/ratings
    docker exec $CONTAINER_ID_COUCHDB curl -X PUT http://127.0.0.1:5984/tags

    # setup Couchdb views
    echo -e "${COLOR_YELLOW}Creating Couch view docs...${COLOR_NO_COLOR}"
    docker exec $CONTAINER_ID_COUCHDB mkdir /scripts
    docker cp ./scripts/couchdb-movies-views.json $CONTAINER_ID_COUCHDB:/scripts/
    docker cp ./scripts/couchdb-tags-views.json $CONTAINER_ID_COUCHDB:/scripts/
    docker cp ./scripts/couchdb-ratings-views.json $CONTAINER_ID_COUCHDB:/scripts/
    docker exec -it $CONTAINER_ID_COUCHDB curl 'http://127.0.0.1:5984/movies/_design/moviesviews' --upload-file /scripts/couchdb-movies-views.json
    docker exec -it $CONTAINER_ID_COUCHDB curl 'http://127.0.0.1:5984/tags/_design/lists' --upload-file /scripts/couchdb-tags-views.json
    docker exec -it $CONTAINER_ID_COUCHDB curl 'http://127.0.0.1:5984/ratings/_design/lists' --upload-file /scripts/couchdb-ratings-views.json

    echo -e "${COLOR_YELLOW}Seeding database for couch...${COLOR_NO_COLOR}"
    docker exec -it $CONTAINER_ID_EXPRESS node ./scripts/couchdb-import.js

else
    echo "$0 start/stop/init/chown/clean/database"

fi