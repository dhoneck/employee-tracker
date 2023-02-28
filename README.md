[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Employee Tracker

## Description
This application is a content management system (CMS) for employee information. A user can keep track of their organization's departments, roles, and employees this CLI program. Data is stored in a MySQL database. View the [demo](https://drive.google.com/file/d/1v3wsPAHGaXsgjtKm8nDpLsrnaKgCxVLY/view).

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [License](#license)
4. [Contributing](#contributing)
5. [Tests](#tests)
6. [Questions](#questions)

## Installation
You must install Node.JS (I used version 16.19.0) on your computer and run `npm i` to install the required modules. The program utilizes MySQL so that must be installed as well. You will need to create the `staff_db` database by running `source <path/to/schema.sql>`. You can also run `source <path/to/seeds.sql>` if you'd like to import some sample data. The final step is to create a dotenv file to contain your MySQL credentials. The file should be named `.env` and contain the following database information: 
```
DB_NAME='staff_db'
DB_USER='your_username' 
DB_PASS='your_pass'
``` 

You should then be ready to use the program.

## Usage
Run `node index.js` to start the application.

## License
This project is covered by the following license: [MIT License](https://opensource.org/licenses/MIT)

## Contributing
If you would like to contribute to the project, please contact me with one of the methods listed in the 'Questions' section.

## Tests
There are no tests for this application.

## Questions
Contact me at:
* GitHub - [dhoneck](https://github.com/dhoneck)
* Email - honeck_34@hotmail.com

