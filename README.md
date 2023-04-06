# Setup
## Download [Node.js](https://nodejs.org/en/download/).

## Install Python 3
Windows:
``` bash
# Install from the Windows Store by running the command
python3
```

## Running the app
Run the following commands:

``` bash
# ONLY IF the 'env' folder doesn't exist, create a python environment
python3 -m venv env

# Activate the python environment
env\Scripts\activate

# Run the flask server on localhost:5000
flask run
```

## Modifying the app
If you edit any Node.js files (files in the static/javascript folder), these commands apply:

``` bash
# Just be sure that you've got parcel js on you system 
npm install -g parcel-bundler

# Install dependencies (only for first time) 
npm i

# Bundle JS files
npx webpack --config webpack.config.js

# Run the flask server on localhost:5000
flask run
```

## Troubleshooting the app

If flask fails to start with `flask run` then try deleting the `env` folder and recreating it with the commands below:

``` bash
# Create python environment
python3 -m venv env

# Activate python environment
env\Scripts\activate

# Install python modules
pip install -r requirements.txt

# Run the flask server on localhost:5000
flask run
```

IF 'instance' folder or 'migrations' folder doesn't exist or work, or you get a database related error, rebuild the database with these commands:
``` bash
# Set up the initial files and folders for managing database changes
flask db init

# Create a new file to record the changes between the current database and the one in your code
flask db migrate

# Update the database structure by applying any pending changes
flask db upgrade

# Run the flask server on localhost:5000
flask run
```