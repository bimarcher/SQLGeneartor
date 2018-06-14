const fs = require('fs');
const exec = require('child_process').exec;

const log = require('./lib/log').Log
const template = require('./lib/template-loader').TemplateLoader
const schemaAnalyzer = require('./lib/schema-analyzer').SchemaAnalyzer
const sqlGenerator = require('./lib/sql-generator').SQLGenerator
const mysqlDBList = require('./conf/db-config').dbList;

const Runner = {
  run: function(scripts, distPath, schemaName) {
    if (scripts.length===1){
      this.doRun(scripts[0], distPath, schemaName);
      log.info(`^-@~@-^【${scripts[0]}】执行完成！！！！！！\n`);
      return;
    }
    if (scripts.length===2){
      this.doRun(scripts[0], distPath, schemaName).then((tag)=>{
        log.info(`^-@~@-^【${scripts[0]}】执行完成！！！！！！\n`);
        return this.doRun(scripts[1], distPath, schemaName);
      }).then((tag)=>{
        log.info(`^-@~@-^【${scripts[1]}】执行完成！！！！！！\n`);
      }).catch((tag)=>{
        log.info(`^-@~@-^【${tag}】执行出错！！！！！！\n`);
      });
      return;
    }
    if (scripts.length===3){
      this.doRun(scripts[0], distPath, schemaName).then((tag)=>{
        log.info(`^-@~@-^【${scripts[0]}】执行完成！！！！！！\n`);
        return this.doRun(scripts[1], distPath, schemaName);
      }).then((tag)=>{
        log.info(`^-@~@-^【${scripts[1]}】执行完成！！！！！！\n`);
        return this.doRun(scripts[2], distPath, schemaName);
      }).then((tag)=>{
        log.info(`^-@~@-^【${scripts[2]}】执行完成！！！！！！\n`);
      }).catch((tag)=>{
        log.info(`^-@~@-^【${tag}】执行出错！！！！！！\n`);
      });
      return;
    }
    log.info(`\n\t输入的命令${scripts.join(",")}无效!\n`);
  },
  doRun: function(type, distPath, schemaName) {
    return new Promise((resolve, reject) => {
      if (type === "clean"){
        this.clean(distPath).then((tag)=>{
          if(tag==='success'){
            resolve('success');
          }else{
            reject('run:doRun:clean:failure');
          }
        });
        return;
      }

      if (type === "sql"){
        this.schemaAnalyzer(distPath, schemaName).then((tag)=>{
          if(tag==='success'){
            resolve('success');
          }else{
            reject('run:doRun:sql:failure');
          }
        });
        return;
      }

      if (type === "db"){
        this.dbCreator(distPath, schemaName).then((tag)=>{
          if(tag==='success'){
            resolve('success');
          }else{
            reject('run:doRun:db:failure');
          }
        });
        return;
      }
      log.info(`\n\t输入的命令${type}无效!\n`);
      reject('run:doRun:failure');
    });
  },
  checkArgv: function(distPath, schemaName, sqlFile) {
    if (!fs.existsSync(distPath)){
      log.info(`\n\t不存在路径为【${distPath}】的输出目录！！！！！！\n`);
      return false;
    }
    if (!schemaName){
      log.info('\n\t请在命令中指定schema！！！！！！\n');
      return false;
    }
    const schemaPath = `./conf/schema-config/${schemaName}.conf`;
    if (!fs.existsSync(schemaPath)){
      log.info(`\n\t不存在路径为【${schemaPath}】的schema的配置文件！！！！！！\n`);
      return false;
    }
    if (sqlFile && !fs.existsSync(sqlFile)){
      log.info(`\n\t不存在路径为【${sqlFile}】的sql文件！！！！！！\n`);
      return false;
    }
    return true;
  },
  clean: function(distPath) {
    var deleteFolder = function(path) {
      var files = [];
      if( fs.existsSync(path) ) {
          files = fs.readdirSync(path);
          files.forEach(function(file,index){
              var curPath = path + "/" + file;
              if(fs.statSync(curPath).isDirectory()) { // recurse
                  deleteFolder(curPath);
              } else { // delete file
                  fs.unlinkSync(curPath);
              }
          });
          fs.rmdirSync(path);
      }
    };
    return new Promise((resolve, reject) => {
      deleteFolder(distPath);
      log.info(`\n\t清除输出文件夹${distPath}成功!\n`);
      
      fs.mkdirSync(distPath);
      log.info(`\n\t创建输出文件夹${distPath}成功!\n`);

      resolve('success');
    });
  },
  schemaAnalyzer: function(distPath, schemaName) {
    return new Promise((resolve, reject) => {
      if (!distPath.endsWith("/")){
        distPath += "/";
      }
      if (!this.checkArgv(distPath,schemaName)){
        return;
      }
      template.run('./template');
      schemaAnalyzer.run(`./conf/schema-config/${schemaName}.conf`, `${distPath}${schemaName}.config.js`,
      `${distPath}${schemaName}.sql`, template, sqlGenerator).then((tag)=>{
        if(tag==='success'){
          resolve('success');
        }else{
          reject('run:schemaAnalyzer:failure');
        }
      });
    });
  },
  doExecSqlFile: function(script,mysqlDB) {
    return new Promise((resolve, reject) => {
      exec(script, (error, stdout, stderr) => {
        if (error) {
          log.info(`\n\texec error: ${error}`)
          reject('run:dbCreator:failure');
          return
        }
        // log.info(`\n\tstdout: ${stdout}`);
        // log.info(`\n\tstderr: ${stderr}`);
        log.info('\n\t' + mysqlDB.host + ' is updated!\n')
        resolve('success');
      })
    });
  },
  dbCreator: function(distPath, schemaName){
    var self = this;
    return new Promise((resolve, reject) => {
      if (!distPath.endsWith("/")){
        distPath += "/";
      }
      const sqlFile = `${distPath}${schemaName}.sql`;
      if (!this.checkArgv(distPath,schemaName, sqlFile)){
        reject('run:dbCreator:failure');
        return;
      }
      return Promise.all(
        mysqlDBList.map(function (mysqlDB) {
          const script = 'mysql -h ' + mysqlDB.host + ' -u' + mysqlDB.user + ' -p' + mysqlDB.pw + ' < ' + sqlFile;
          return self.doExecSqlFile(script,mysqlDB);
        })).then(() => {
          resolve("success");
        }).catch(()=>{
          reject('run:dbCreator:failure');
        });
    });
  }
}

const scripts = process.argv[2].split(",");
const distPath = process.argv[3];
const schemaName = process.argv[4];
Runner.run(scripts, distPath, schemaName);