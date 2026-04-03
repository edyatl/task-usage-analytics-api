#!/bin/bash

# Use psql to execute SQL commands with environment variables
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE ${POSTGRES_DB};
EOSQL
