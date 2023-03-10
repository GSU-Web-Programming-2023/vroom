## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

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

# Run the flask server
flask run
```
