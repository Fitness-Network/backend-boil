#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

program.parse();

const projectName = program.args[0];

if (!projectName) throw new Error("Project name must be provide");

const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);

fs.mkdirSync(projectDir, { recursive: true });
fs.cpSync(__dirname, projectDir, { recursive: true })

const packageJson = require(path.join(projectDir, 'package.json'));
packageJson.name = projectName;
packageJson.description = `Nestjs project generate by Martin`
delete packageJson.bin;

fs.writeFileSync(
  path.join(projectDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
)

fs.copyFileSync(path.join(projectDir, 'env.example'), path.join(projectDir, '.env'))
console.log(`Modify .env to config app`);

console.log(`Created ${projectName} at ${projectDir}`);
