# Setup
## Download [Node.js](https://nodejs.org/en/download/).

## Install Python 3
Windows:
``` bash
# Install from the Windows Store by running the command
python3
```

## Run the app
Run the following commands:

``` bash
# IF the 'env' folder doesn't exist, create a python environment
python3 -m venv env

# Activate the python environment
env\Scripts\activate

# IF the 'env' folder doesn't exist, install python modules
pip install -r requirements.txt

# IF 'instance' folder or 'migrations' folder doesn't exist or work, build the database
flask db init && flask db migrate && flask db upgrade

# Run the flask server on localhost:5000
flask run
```

If flask fails to start with `flask run` then try deleting the `env` folder and recreating it with the commands below:

``` bash
# Create python environment
python3 -m venv env

# Activate python environment
env\Scripts\activate

# Install python modules
pip install -r requirements.txt
```

If you edit Node.js, these commands apply:

``` bash
# Just be sure that you've got parcel js on you system
npm install -g parcel-bundler

# Install dependencies (only for first time)
npm i

# Bundle JS files
npx webpack --config webpack.config.js
```