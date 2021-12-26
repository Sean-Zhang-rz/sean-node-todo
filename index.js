const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  // 读取之前的任务
  const list = await db.read()
  // 向里面增加一项任务
  list.push({ title, done:false})
  // 存储到文件
  await db.write(list)
}
module.exports.clear = async () => {
  await db.write([])
}
const printTasks = (list)=> {
  list.forEach((item, index) => {
    console.log(`[${item.done ? 'x' : '-'}] ${index + 1} - ${item.title}`);
  })
}
function finish(list, index) {
  list[index].done = true;
  db.write(list)
}
function undo(list, index) {
  list[index].done = false;
  db.write(list)
}
function deleteTask(list, index) {
  list.splice(index, 1)
  db.write(list)
}
function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: "请输入新标题",
    default: list[index].title
  }).then(({ title }) => {
    list[index].title = title;
    db.write(list)
  });
}
const askForAction = (list, index)=> {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择要操作',
      choices: [
        { name: '退出', value: 'quit' },
        { name: '已完成', value: 'finish' },
        { name: '未完成', value: 'undo' },
        { name: '删除', value: 'deleteTask' },
        { name: '改标题', value: 'updateTitle' },
      ],
    }).then(({ action }) => {
      const actions = { finish, undo, deleteTask, updateTitle }
      const act = actions[action]
      act && act(list, index)
    })
}

const createTasks = (list) => {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: "请输入任务标题",
    }).then(({ title }) => {
      list.push({ title, done: false });
      db.write(list)
    });
}

module.exports.showAll = async () => {
  const list = await db.read()
  // printTasks
  printTasks(list);
  inquirer
    .prompt({
        type: 'list',
        name: 'index',
        message: '请选择要操作的任务',
        choices: [{name:'退出', value: -1}, ...list.map((item, index)=>{
          return {
            name: `[${item.done ? 'x' : '-'}] ${index + 1} - ${item.title}`,
            value: index.toString(),
          };
        }), { name: '创建任务', value: -2}],
      }).then((answer) => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(list, index)
      }else if (index === -2){
        createTasks(list)
      }
    });
}