## Prerequisites

Before proceeding, ensure that you have Python (version 3.6 or higher) installed on your system. If you do not have Python installed, you can download it from the [official Python website](https://www.python.org/downloads/).

## Installation Steps

1. **Clone the repository**

   First, clone the application's GitHub repository to your local machine by running the following command in your terminal or command prompt:

`git clone https://github.com/GSU-Web-Programming-2023/o-o-game.git`


This will create a folder named `o-o-game` in your current directory.

2. **Navigate to the project folder**

Change your current directory to the `o-o-game` folder:

`cd o-o-game`


3. **Create a virtual environment (optional but recommended)**

It is recommended to create a virtual environment for your project to isolate the dependencies. To create a virtual environment, run the following command:

`python -m venv venv`


This will create a virtual environment named `venv`. To activate the virtual environment, run the following command:

- On Windows:

  ```
  venv\Scripts\activate
  ```

- On macOS and Linux:

  ```
  source venv/bin/activate
  ```

You should see `(venv)` at the beginning of your command prompt, indicating that the virtual environment is active.

4. **Install the required packages**

The `requirements.txt` file contains a list of all the necessary packages for the web application. Install these packages using the following command:

`pip install -r requirements.txt`

This will install all the required packages, including Flask, Flask-Cors, Flask-Migrate, Flask-SQLAlchemy, and PyMySQL, among others.

5. **Configure the environment variables**

The application uses environment variables to store sensitive information such as database credentials. Create a `.env` file in the root directory of the project and add the following variables:

```
DB_USERNAME=<your_database_username>
DB_PASSWORD=<your_database_password>
DB_HOST=<your_database_host>
DB_NAME=<your_database_name>
```

Replace `<your_database_username>`, `<your_database_password>`, `<your_database_host>`, and `<your_database_name>` with the appropriate values for your database.

6. **Initialize the database**

Before running the application, you need to set up and initialize the database. Run the following command:

`flask db init`

Next, apply the migrations with the following command:

`flask db migrate`

Finally, upgrade the database to the latest revision by running:

`flask db upgrade`

7. **Run the application**

You can now run the application using the following command:

`flask run`

This will start the web application on your local development server, typically accessible at `http://127.0.0.1:5000` or `http://localhost:5000`.

![](readme.svg)