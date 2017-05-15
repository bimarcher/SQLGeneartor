const log = require('./lib/log').Log
const info = '\n\t1.npm run sql : 生成sql语句;' +
            '\n\t2.npm run db : 执行sql创建数据库;' +
            '\n\t3.npm run all : 生成sql语句后直接执行sql创建数据库;'
log.info(info)
