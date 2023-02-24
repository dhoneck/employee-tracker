// Import inquirer module
const inquirer = require("inquirer");
const db = require("./dbManager");
const cTable = require("console.table");

const MENU_QUESTIONS = [
  {
    type:"list",
    name:"nextAction",
    message:"What would you like to do? ",
    choices: [
      "View All Employees", 
      "Add Employee", 
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit"
    ],
  },
]

class Prompter {
  // Displays a menu using inquirer
  showMenu() {
    inquirer
      .prompt(MENU_QUESTIONS)
      .then(data => {
        // Direct user to next section based on input
        let nextAction = data["nextAction"];
        if (nextAction == "View All Employees") {
          displayAllFromTable('employee');
        } else if (nextAction == "Add Employee") {
        } else if (nextAction == "Update Employee Role") {
        } else if (nextAction == "View All Roles") {
          displayAllFromTable('role');
        } else if (nextAction == "Add Role") {
        } else if (nextAction == "View All Departments") {
          displayAllFromTable('department');
        } else if (nextAction == "Add Department") {
        } else if (nextAction == "Quit") {
        }
      });
  }
}

function displayAllFromTable(tableName) {
  db.query(`SELECT * FROM ${tableName}`, function (err, results) {
    console.table(results);
  });
}

module.exports = Prompter;
