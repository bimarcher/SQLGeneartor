const fs = require('fs')
const moment = require("moment")
const exec = require('child_process').exec

const schema = require('./schema-config')

const mysqlDBList = [
  {
    host: 'localhost',
    user: 'root',
    pw: 'mysql.root'
  },
  {
    host: '10.0.177.242',
    user: 'root',
    pw: 'tyTeam666'
  }
]

const sqlFile = './sql/' + schema.schemaName + '.sql'

const log = {
  prefix: function(){
    return '@@@ debug by archer @@@ ' + moment().format('YYYY-MM-DD HH:mm:ss:SSS' + ' : ' )
  },
  info: function(info){
    console.log(this.prefix() + info)
  }
}

for(let i = 0; i < mysqlDBList.length; i++){
  const mysqlDB = mysqlDBList[i]
  const script = 'mysql -h ' + mysqlDB.host + ' -u' + mysqlDB.user + ' -p' + mysqlDB.pw + ' < ' + sqlFile
  exec(script, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    log.info(mysqlDB.host + ' is updated!')
  })
}
