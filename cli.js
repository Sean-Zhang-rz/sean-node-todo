#!/usr/bin/env node
const { Command } = require('commander');
const api = require('./index.js')
const program = new Command();

program
  .option('-x, --xxx', 'xxxxxxx')

program
  .command('add')
  .description('add a task')
  .action((...args) => {
    const words = args.slice(0, - 1).join(" ")
    api.add(words)
  });

program
  .command('clear')
  .description('clear tasks')
  .action(() => {
    api.clear();
  });


program.parse(process.argv);
// 直接展示
if (process.argv.length === 2) {
  api.showAll();
}