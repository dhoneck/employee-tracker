// Import inquirer module
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./dbManager");

// Inquirer Questions
const MENU_QUESTIONS = [
  {
    type:"list",
    name:"nextAction",
    message:"What would you like to do? ",
    choices: [
      "View All Employees",
      "View All Roles",
      "View All Departments",
      "Add Employee",
      "Add Role",
      "Add Department",
      "Update Employee Role",
      "Quit"
    ],
  },
]

const ADD_DEPARTMENT_QUESTIONS = [
  {
    type:"input",
    name:"name",
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
    name:"departmentId",
    message:"What department does this role belong to? ",
    choices: [],
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
    name:"roleId",
    message:"What is their role? ",
    choices: [],
  },
  {
    type:"list",
    name:"managerId",
    message:"Who is their manager? ",
    choices: [],
  },
]

const UPDATE_EMPLOYEE_QUESTIONS = [
  {
    type:"list",
    name:"employeeId",
    message:"What employee would you like to update? ",
    choices: [],
  },
  {
    type:"list",
    name:"roleId",
    message:"What role should they be changed to? ",
    choices: [],
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
          this.displayEmployees();
        } else if (nextAction == "Add Employee") {
          this.addEmployee();
        } else if (nextAction == "Update Employee Role") {
          this.updateEmployeeRole();
        } else if (nextAction == "View All Roles") {
          this.displayRoles();
        } else if (nextAction == "Add Role") {
          this.addRole();
        } else if (nextAction == "View All Departments") {
          this.displayDepartments();
        } else if (nextAction == "Add Department") {
          this.addDepartment();
        } else if (nextAction == "Quit") {
          console.log('Disconnecting database.');
          db.end();
          console.log('Quitting the application.');
          process.exit();
        }
      })
  }

  // Add a department to the department table
  addDepartment() {
    inquirer
      .prompt(ADD_DEPARTMENT_QUESTIONS)
      .then(data => {
        db.query(`INSERT INTO department (name) VALUES (?)`, data.name);
        console.log(`Added ${data.name} to the department table.\n`);
        this.showMenu();
      });
  }

  // Add a role to the role table
  addRole() {
    // Reset department choice array for role questions
    ADD_ROLE_QUESTIONS[2].choices = [];

    // Get department information and add to choice array for role questions
    db.query('SELECT * FROM department', (err, departments) => {
      if (departments == false) { // No departments found - do not allow user to add role
        console.log('Add at least one department before adding a role.\n');
        this.showMenu();
      } else { // At least one department found - allow user to add role
        // Add departments as a choice
        for (let department of departments) {
          ADD_ROLE_QUESTIONS[2].choices.push(`${department.id} - ${department.name}`);
        }

        // Ask role questions
        inquirer
        .prompt(ADD_ROLE_QUESTIONS)
        .then(data => {
          // Grab id from result and convert to an int
          data.departmentId = parseInt(data.departmentId.split(' ')[0]);

          // Insert data into role table
          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          const params = [data.title, data.salary, data.departmentId];
          db.query(sql, params , (err, result) => {
            if (err) {
              console.log(`Error: ${err.sqlMessage}`);
              console.log(`${data.title} was not added to the role table.\n`)
            } else {
              console.log(`Added ${data.title} to the role table.\n`);
            }
            this.showMenu();
          });
        })
      }
    });     
  }

  // Add an employee to the role table
  addEmployee() {
    // Reset role and manager choice arrays for employee questions
    ADD_EMPLOYEE_QUESTIONS[2].choices = [];
    ADD_EMPLOYEE_QUESTIONS[3].choices = ['No manager'];

    // Get role information and add to choice array for employee questions
    db.query('SELECT id, title FROM role', (err, roles) => {
      if (roles == false) { // No roles found - do not allow user to add employee
        console.log('Add at least one role before adding an employee.\n');
        this.showMenu();
      } else { // At least one role found - allow user to add employee
        // Add roles as a choice
        for (let role of roles) {
          ADD_EMPLOYEE_QUESTIONS[2].choices.push(`${role.id} - ${role.title}`);
        }

        // Get employee information
        db.query('SELECT * FROM employee', (err, employees) => {
          // Add employees as a choice
          for (let employee of employees) {
            ADD_EMPLOYEE_QUESTIONS[3].choices.push(`${employee.id} - ${employee.first_name} ${employee.last_name}`);
          }

          // Ask employee questions
          inquirer
          .prompt(ADD_EMPLOYEE_QUESTIONS)
          .then(data => {
            // Grab ids from result and convert to ints
            data.roleId = parseInt(data.roleId.split(' ')[0]);
            if (data.managerId == 'No manager') {
              data.managerId = null;
            } else {
              data.managerId = parseInt(data.managerId.split(' ')[0]);
            }

            // Insert data into employee table
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            const params = [data.firstName, data.lastName, data.roleId, data.managerId];
            db.query(sql, params , (err, result) => {
              console.log(`Added ${data.firstName} ${data.lastName} to the employee table.\n`);
              this.showMenu();
            });
          });
        });
      }
    });
  }

  // Update a employee's role in the employee table
  updateEmployeeRole() {
    // Reset employee and role choice array for the update employee questions
    UPDATE_EMPLOYEE_QUESTIONS[0].choices = [];
    UPDATE_EMPLOYEE_QUESTIONS[1].choices = [];

    // Get employee information and add to choice array
    db.query('SELECT * FROM employee', (err, employees) => {
      // Add employees as a choice
      for (let employee of employees) {
        UPDATE_EMPLOYEE_QUESTIONS[0].choices.push(`${employee.id} - ${employee.first_name} ${employee.last_name}`);
      }

      // Get role information and add to choice array
      db.query('SELECT * FROM role', (err, roles) => {
        // Add roles as a choice
        for (let role of roles) {
          UPDATE_EMPLOYEE_QUESTIONS[1].choices.push(`${role.id} - ${role.title}`);
        }

        // Ask questions to update employee role
        inquirer
        .prompt(UPDATE_EMPLOYEE_QUESTIONS)
        .then(data => {
          // Grab ids from result and convert to ints
          data.employeeId = parseInt(data.employeeId.split(' ')[0]);
          data.roleId = parseInt(data.roleId.split(' ')[0]);

          // Insert data into employee table
          const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
          const params = [data.roleId, data.employeeId];
          db.query(sql, params , (err, result) => {
            console.log(`Updated the role for the employee.\n`);
            this.showMenu();
          });
        });
      });
    });
  }

  // Displays the departments from the department table
  displayDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      if (result == false) {
        console.log('No results from the department table.\n');
      } else {
        console.table(result);
      }
      this.showMenu();
    });
  }

  // Displays the roles from the role table
  displayRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
                 FROM role 
                 INNER JOIN department On role.department_id = department.id`;
    db.query(sql, (err, result) => {
      if (result == false) {
        console.log('No results from the role table.\n');
      } else {
        console.table(result);
      }
      this.showMenu();
    });
  }

  // Displays the employees from the employee table
  displayEmployees() {
    const sql = `SELECT 
                  e1.id, 
                  e1.first_name, 
                  e1.last_name, 
                  r.title, 
                  d.name AS department, 
                  r.salary, 
                  CONCAT(e2.first_name, ' ', e2.last_name) AS manager
                 FROM employee e1
                 LEFT JOIN employee e2 ON e1.manager_id = e2.id
                 INNER JOIN role AS r ON e1.role_id = r.id
                 INNER JOIN department AS d ON r.department_id = d.id`;
    db.query(sql, (err, result) => {
      if (result == false) {
        console.log('No results from the employee table.\n');
      } else {
        console.table(result);
      }
      this.showMenu();
    });
  }
}

module.exports = Prompter;
