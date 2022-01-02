//Call dependencies for fs and inquirer
const fs = require('fs');
const inquirer = require('inquirer');

//Object containing license info
const licenses = {
   "MIT License": {
      badge: '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)'
   },
   "ISC License": {
      badge: '[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)'
   },
   "Apache License 2.0": {
      badge: '[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)'
   },
   "GNU GPLv3": {
      badge: '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)'
   }
};

//Prompts for info about the project
const questions = [

   //Project title
   {
      type: 'input',
      message: 'What is the name of the project?',
      name: 'projectTitle',
      validate: function (input) {
         if (input.length < 5) {
            return 'Project title must be greater than 5 characters.';
         }
         return true;
      }
   },

//Description
   {
      type: 'editor',
      message: 'Enter the description of the project: ',
      name: 'projectDescription',
      default: `Edit contents here, including removing these instructions.\nUse markdown for formatting multi-step usage instructions and inserting screenshots, then save and close window to continue.`,
   },

//Table of contents
   {
      type: 'confirm',
      message: 'Do you want a table of contents?',
      name: 'includeTOC',
   },


//Installation instructions
   {
      type: 'input', 
      message: 'Provide instructions for installing the project: ',
      name: 'installation',
      default: 'Type installation instructions here, using markdown formatting if necessary, and press enter to continue...'
   },

//Usage
   {
      type: 'editor',
      message: 'Provide instructions for using the application: ',
      default: `Edit contents here, including removing these instructions.\nUse markdown for formatting multi-step usage instructions and inserting screenshots, then save and close window to continue.`,
      name: 'usage'
   },


//License info (list of options)
   {
      type: 'checkbox',
      message: 'What licence(s) should be referenced? Select "None" if the desired option is not listed and manually add it later.',
      name: 'license',
      choices: [
         {
            name: 'MIT License',
            checked: true
         },
         {
            name: 'ISC License'
         },
         {
            name: 'Apache License 2.0'
         },
         {
            name: 'GNU GPLv3'
         },
         {
            name: 'None'
         }
      ],
   },


//Contribution guidelines
   {
      type: 'input', 
      message: 'Provide details on how others can contribute to the project: ',
      name: 'contribution',
      default: 'Type instructions for contributing to the project, using markdown formatting if necessary, and press enter to continue...' 
   },

//Credits
   {
      type: 'confirm',
      message: 'Do you have any collaborators or other attributions to acknowledge?',
      name: 'confirmCredits'
   },   


   {
      type: 'editor',
      message: 'Provide details on applicable credits: ',
      default: `Edit contents here, including removing these instructions, then save and close window to return to the program and continue.\nList collaborators with links to their GitHub profiles, attribute third-party assets and their creators, and link any tutorials or other resources.\nUse markdown to format content and insert links if necessary.`,
      name: 'credits',
      when: function (input) {
         return input.confirmCredits;
      }
   },


//Test instructions
   {
      type: 'confirm',
      message: 'Does the project have test instructions?',
      name: 'confirmTests'
   },   

   {
      type: 'input', 
      message: 'Add instructions for testing the project: ',
      default: 'Type instructions here, using markdown if necessary, then press enter to continue...',
      name: 'testInstructions',
      when: function (input) {
         return input.confirmTests;
      }
   },

//Questions section
   {
      type: 'prompt',
      message: 'Enter your GitHub username: ',
      name: 'username'
   },

   {
      type: 'prompt',
      message: 'Enter email address users and contributers can reach you at: ',
      name: 'email'
   }
]


//Function to write README file
function generate(input) {
   
   const { projectTitle, projectDescription, includeTOC, installation, usage, license, contribution, confirmCredits, credits, confirmTests, testInstructions, email, username } = input;
   
   //Code for generating license badges as a single string
   let licenseString = "";
   license.forEach(element => {
      licenseString += `${licenses[element].badge}  `;
   });
   
   //Template 
   return `
# ${projectTitle}\n
${licenseString}\n
### Description\n${projectDescription}\n
${includeTOC ? `### Table of Contents\n- [Installation](#installation)\n- [Usage](#usage)\n- [License](#license)\n- [How to contribute](#contribute)\n- [Credits (conditional)](#credits)\n- [Test instructions (conditional)](#tests)\n- [Questions](#questions)\n` : ''}
### Installation\n${installation}\n
### Usage\n${usage}\n
### License\nLicensed under the following: ${license.join(', ')}\n
### Contributing\n${contribution}\n
${confirmCredits ? `### Accreditations\n${credits}\n` : ''}
${confirmTests ? `### Tests\n${testInstructions}\n` : ''}
### Questions\nIf you have any questions about the project, please feel free to message at **${email}**, or connect with me on GitHub: **[${username}](https://github.com/${username})**\n
`}

//Function to initialize program 
async function init() {
   const input = await inquirer.prompt(questions);
   fs.writeFile("README.md", generate(input), (err) => err && console.error(err));
   console.log("README generated successfully!");
}

//Function call to initialize program
init();