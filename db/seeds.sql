USE staff_db;

INSERT INTO department (name)
VALUES ('Management'),
       ('Sales'),
       ('HR'),
       ('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES ('Regional Manager', 120000, 1),
       ('Assistant to Regional Manager', 80000, 1),
       ('Sales Representative', 80000, 2),
       ('HR Representative', 70000, 3),
       ('Warehouse Foreman', 55000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Michael', 'Scott', 1, NULL),
       ('Dwight', 'Shrute', 2, 1),
       ('Jim', 'Halpert', 3, 1),
       ('Toby', 'Flenderson', 4, 1),
       ('Darryl', 'Philbin', 5, 1);