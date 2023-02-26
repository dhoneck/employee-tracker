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

const ADD_DEPARTMENT_QUESTIONS = [
  {
    type:"input",
    name:"departmentName",
    message:"What department do you want to add? ",
  },
];

const ADD_ROLE_QUESTIONS = [
  {
    type:"input",
    name:"title",
    message:"What is the title of the role? ",
  },
  {
    type:"number",
    name:"salary",
    message:"What is the salary of the role? ",
  },
  {
    type:"list",
    name:"department",
    message:"What department does this role belong to? ",
    choices: [
      "Department placeholder 1", 
      "Department placeholder 2", 
      "Department placeholder 3", 
      "Department placeholder 4" 
    ],
  },
]

const ADD_EMPLOYEE_QUESTIONS = [
  {
    type:"input",
    name:"firstName",
    message:"What is the employee's first name? ",
  },
  {
    type:"input",
    name:"lastName",
    message:"What is their last name? ",
  },
  {
    type:"list",
    name:"role",
    message:"What is their role? ",
    choices: [
      "Role placeholder 1", 
      "Role placeholder 2",
      "Role placeholder 3", 
      "Role placeholder 4" 
    ],
  },
  {
    type:"list",
    name:"manager",
    message:"Who is their manager? ",
    choices: [
      "Manager placeholder 1", 
      "Manager placeholder 2",
      "Manager placeholder 3", 
      "Manager placeholder 4" 
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
          this.displayAllFromTable('employee');
        } else if (nextAction == "Add Employee") {
          this.addEmployee();
        } else if (nextAction == "Update Employee Role") {
        } else if (nextAction == "View All Roles") {
          this.displayAllFromTable('role');
        } else if (nextAction == "Add Role") {
          this.addRole();
        } else if (nextAction == "View All Departments") {
          this.displayAllFromTable('department');
        } else if (nextAction == "Add Department") {
          this.addDepartment();
        } else if (nextAction == "Quit") {
          console.log('Disconnecting Database.');
          db.end()
          console.log('Quitting the application.');
          process.exit();
        }
      })
  }

  addDepartment() {
    inquirer
      .prompt(ADD_DEPARTMENT_QUESTIONS)
      .then(data => {
        console.log('Department data to add');
        console.log(data);
        let departmentName = data["departmentName"];
        console.log(`Attempting to add ${departmentName} to the department table`);
        db.query(`INSERT INTO department (name) VALUES (?)`, departmentName);
        this.showMenu();
      })
  }

  addRole() {
    inquirer
      .prompt(ADD_ROLE_QUESTIONS)
      .then(data => {
        console.log('Role data to add');
        console.log(data);
        this.showMenu();
      })
  }

  addEmployee() {
    inquirer
      .prompt(ADD_EMPLOYEE_QUESTIONS)
      .then(data => {
        console.log('Employee data to add');
        console.log(data);
        this.showMenu();
      })
  }

  displayAllFromTable(tableName) {
    db.query(`SELECT * FROM ${tableName}`, (err, result) => {
      if (err) {
        console.log('displaying an error');
      } else {
        console.log('displaying a result');
        console.table(result);
        this.showMenu();
      }
    });
  }
}

module.exports = Prompter;
