const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const { program } = require('commander');

const projectDir = process.cwd();
program.parse();

const projectName = program.args[0];
const dockerImage = program.args[1];

if (!projectName) throw new Error("Project name must be provide");
if (!dockerImage) throw new Error("Docker image must be provide");

const template = fs.readFileSync(path.join(__dirname, 'template.yaml'));
const content = Handlebars.compile(template.toString())({
  name: projectName,
  dockerImage: dockerImage
})

fs.mkdirSync(path.join(projectDir, 'k8s'), { recursive: true, })
fs.writeFileSync(path.join(projectDir, 'k8s/template.yaml'), content)
console.log("Your k8s template was created in k8s/template.yaml")
