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
        docker exec -d $CONTAINER_ID_EXPRESS node
    else
        ENVIRONMENT=$ENVIRONMENT_DEV
        echo -e "Starting the containers in the ${COLOR_GREEN}${ENVIRONMENT}${COLOR_NO_COLOR} environment."

        docker-compose up -d

        CONTAINER_ID_EXPRESS=`docker-compose ps -q express`
        docker exec -d $CONTAINER_ID_EXPRESS nodemon
    fi

}

function update_permissions(){
    docker-compose exec --privileged --user=root express chown -R www-data:www-data *
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

elif [[ $1 == 'initialize' ]]; then
    docker-compose build
    docker-compose create

    start_containers $2

    CONTAINER_ID_EXPRESS=`docker-compose ps -q express`
    CONTAINER_ID_MONGODB=`docker-compose ps -q mongodb`

    # seed the db
    ./manage.sh database seed-data

elif [[ $1 == 'clean' ]]; then
    ./manage.sh stop
    docker-compose down --remove-orphans
    docker volume rm backend_mongo_data

elif [[ $1 == 'database' && $2 == 'seed-data' ]]; then
    CONTAINER_ID_MONGODB=`docker-compose ps -q mongodb`

    # copy seed files to the container
    docker exec $CONTAINER_ID_MONGODB mkdir /seeds
    docker cp ./seeds/movies.csv $CONTAINER_ID_MONGODB:/seeds/
    docker cp ./seeds/ratings.csv $CONTAINER_ID_MONGODB:/seeds/
    docker cp ./seeds/tags.csv $CONTAINER_ID_MONGODB:/seeds/
    # load data into database
    docker exec $CONTAINER_ID_MONGODB mongoimport --db praca_inz --type csv --headerline --file /seeds/movies.csv
    docker exec $CONTAINER_ID_MONGODB mongoimport --db praca_inz --type csv --headerline --file /seeds/ratings.csv
    docker exec $CONTAINER_ID_MONGODB mongoimport --db praca_inz --type csv --headerline --file /seeds/tags.csv
    # load setup scripts
    docker cp ./scripts/mongo-setup-indexes.js $CONTAINER_ID_MONGODB:/seeds/
    docker exec $CONTAINER_ID_MONGODB mongo /seeds/mongo-setup-indexes.js
    # remove the files after
    docker exec $CONTAINER_ID_MONGODB rm -rf /seeds

else
    echo "$0 start/stop/initialize/chown/database"

fi