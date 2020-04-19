const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
let employeesCreated = 0;
let totalEmployees;

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const teamMembers = [];
const managerQuestions = [
  {
    type: "input",
    name: "name",
    message: "Enter Manager Name:",
  },
  {
    type: "input",
    name: "id",
    message: "Enter Manager ID:",
  },
  {
    type: "input",
    name: "email",
    message: "Enter Manager Email:",
  },
  {
    type: "input",
    name: "office-number",
    message: "Enter Manager Office Number:",
  },
  {
    type: "input",
    name: "team",
    message: "How many more team members do you have?",
  },
];
const employeeQuestions = [
  {
    type: "input",
    name: "name",
    message: "Enter Employee Name:",
  },
  {
    type: "input",
    name: "id",
    message: "Enter Employee ID:",
  },
  {
    type: "input",
    name: "email",
    message: "Enter Employee Email:",
  },
  {
    type: "list",
    name: "role",
    message: "What is the Employee Role?",
    choices: ["Engineer", "Intern"],
  },
  {
    when: (input) => {
      return input.role == "Engineer";
    },
    type: "input",
    name: "github",
    message: "Engineer enter your GitHub username:",
  },
  {
    when: (input) => {
      return input.role == "Intern";
    },
    type: "input",
    name: "school",
    message: "Intern enter your School Name:",
  },
];
const createEmployee = function () {
  inquirer.prompt(employeeQuestions).then(function(answers) {
    if (answers.role === "Engineer") {
      const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github)
      teamMembers.push(engineer);
    } else {
      const intern = new Intern(answers.name, answers.id, answers.email, answers.school)
      teamMembers.push(intern);

    }
    employeesCreated++;
    if (employeesCreated < totalEmployees) {
      createEmployee();
    } else {
      const html = render(teamMembers);
      fs.writeFile(outputPath, html, function(err){
        if (err) {
          throw err;
        }
      })
    }
  });
};
inquirer.prompt(managerQuestions).then(function (answers) {
  const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber)
  teamMembers.push(manager);
  totalEmployees = answers.team;
  if(totalEmployees){
    createEmployee();
  } else {
    const html = render(teamMembers);
    fs.writeFile(outputPath, html, function(err){
      if (err) {
        throw err;
      }
    })
  }});

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
