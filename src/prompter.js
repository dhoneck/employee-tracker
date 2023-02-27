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
        db.query(`INSERT INTO department (name) VALUES (?)`, data.name);
        console.log(`Added ${data.name} to the department table.\n`);
        this.showMenu();
      })
  }

  addRole() {
    // Reset department ID choice array for role questions
    ADD_ROLE_QUESTIONS[2].choices = [];

    // Get department information and add to choice array for role questions
    db.query('SELECT * FROM department', (err, departments) => {
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
          console.log(`Added ${data.title} to the department table.\n`);
          this.showMenu();
        });
      })
    });     
  }

  addEmployee() {
    // Reset role and manager ID choice arrays for employee questions
    ADD_EMPLOYEE_QUESTIONS[2].choices = [];
    ADD_EMPLOYEE_QUESTIONS[3].choices = ['No manager'];

    // Get role information and add to choice array for employee questions
    db.query('SELECT id, title FROM role', (err, roles) => {
      for (let role of roles) {
        ADD_EMPLOYEE_QUESTIONS[2].choices.push(`${role.id} - ${role.title}`);
      }

      db.query('SELECT * FROM employee', (err, employees) => {
        for (let employee of employees) {
          ADD_EMPLOYEE_QUESTIONS[3].choices.push(`${employee.id} - ${employee.first_name} ${employee.last_name}`);
        }
      });
    });

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
  }

  updateEmployeeRole() {
    // Reset employee and role ID choice array
    UPDATE_EMPLOYEE_QUESTIONS[0].choices = [];
    UPDATE_EMPLOYEE_QUESTIONS[1].choices = [];

    // Get employee information and add to choice array
    db.query('SELECT * FROM employee', (err, employees) => {
      for (let employee of employees) {
        UPDATE_EMPLOYEE_QUESTIONS[0].choices.push(`${employee.id} - ${employee.first_name} ${employee.last_name}`);
      }
      db.query('SELECT * FROM role', (err, roles) => {
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

  displayDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      console.table(result);
      this.showMenu();
    });
  }

  displayRoles() {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
                 FROM role 
                 INNER JOIN department On role.department_id = department.id`;
    db.query(sql, (err, result) => {
      console.table(result);
      this.showMenu();
    });
  }

  // id, first_name, last_name, title, department, salary, manager
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
      console.table(result);
      this.showMenu();
    });
  }
}

module.exports = Prompter;
