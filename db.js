const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const fs = require('fs')
const p = require('path');
const dbPath = p.join(home, '.sean-todo')

const db = {
  read(path = dbPath){
    return new Promise((res, rej) => { // Promise经典用法，在异步操作里返回值
      fs.readFile(dbPath, { flag: 'a+' }, (error, data) => {
        if (error) return rej(error)
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (e) {
          list = []
        }
        res(list)
      })
    })
  },
  write(list, path = dbPath) {
    return new Promise((res, rej)=>{
      const string = JSON.stringify(list)
      fs.writeFile(path, string, error => {
        error ? rej(error): res();
      })
    })
  }
}
module.exports = db