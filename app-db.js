const fs = require('fs')
const exec = require('child_process').exec

const log = require('./log').Log

const schema = require('./conf/schema-config')
const mysqlDBList = require('./conf/db-config').dbList

const sqlFile = './sql/' + schema.schemaName + '.sql'

for(let i = 0; i < mysqlDBList.length; i++){
  const mysqlDB = mysqlDBList[i]
  const script = 'mysql -h ' + mysqlDB.host + ' -u' + mysqlDB.user + ' -p' + mysqlDB.pw + ' < ' + sqlFile
  exec(script, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    log.info(`stdout: ${stdout}`);
    log.info(`stderr: ${stderr}`);
    log.info(mysqlDB.host + ' is updated!')
  })
}
