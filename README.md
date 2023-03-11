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
# Create python environment
python3 -m venv env

# Activate python environment
env\Scripts\activate

# Install python modules
pip install -r requirements.txt

# Just be sure that you've got parcel js on you system
npm install -g parcel-bundler

# Install dependencies (only for first time)
npm i

# Bundle JS files
npx webpack --config webpack.config.js

# Run the flask server on localhost:5000
flask run
```

If you have issues running the app, try deleting the `node_modules` folder and running `npm i` again.
If flask fails to start with `flask run` then try deleting the `env` folder and recreating it with the commands below:

``` bash
# Create python environment
python3 -m venv env

# Activate python environment
env\Scripts\activate

# Install python modules
pip install -r requirements.txt
```
