const Handlebars = require('handlebars');
const fs = require('fs')
const path = require('path');
const { program } = require('commander');
const { cwd } = require('process');

program.parse();
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const moduleName = program.args[0];
if (!moduleName) throw new Error("Module name must be provide")

const metadata = {
  Name: capitalizeFirstLetter(moduleName),
  name: moduleName
}

const compileFiles = [
  {
    path: 'schema.hbs',
    convert: `${moduleName}.schema.ts`
  },
  {
    path: 'service.hbs',
    convert: `${moduleName}.service.ts`
  },
  {
    path: 'controller.hbs',
    convert: `${moduleName}.controller.ts`
  },
  {
    path: 'module.hbs',
    convert: `${moduleName}.module.ts`
  },
  {
    path: 'dto/create.hbs',
    convert: `dto/create.ts`
  },
  {
    path: 'dto/get.hbs',
    convert: `dto/get.ts`
  },
  {
    path: 'dto/update.hbs',
    convert: `dto/update.ts`
  },
  {
    path: 'dto/delete.hbs',
    convert: `dto/delete.ts`
  },
  {
    path: 'spec.hbs',
    convert: `${moduleName}.spec.ts`
  }
]

const outdir = path.join(cwd(), 'src/modules', moduleName);
fs.mkdirSync(outdir);
fs.mkdirSync(path.join(outdir, 'dto'))

compileFiles.map((file) => {
  const f = fs.readFileSync(path.join(__dirname, file.path));
  const template = Handlebars.compile(f.toString());
  const content = template(metadata);
  fs.writeFileSync(path.join(outdir, file.convert), content);
})
