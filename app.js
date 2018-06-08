const log = require('./lib/log').Log
const info = 
  '\n\t0.npm run clean : ' +
  '\n\t\t清理输出目录的所有文件;\n' +
  '\n\t1.npm run sql [schemaConfigName] : ' +
  '\n\t\t只生成[schemaConfigName]对应的sql脚本;\n' +
  '\n\t2.npm run db [schemaConfigName] : ' +
  '\n\t\t只基于[schemaConfigName]对应的sql脚本创建数据库;\n' +
  '\n\t3.npm run clean,sql [schemaConfigName] :' +
  '\n\t\t清理输入目录后，生成[schemaConfigName]对应的sql脚本;\n' +
  '\n\t4.npm run sql,db [schemaConfigName] : ' +
  '\n\t\t生成[schemaConfigName]对应的sql脚本并创建数据库;\n' +
  '\n\t5.npm run clean,sql,db [schemaConfigName]: ' +
  '\n\t\t清理输入目录后，生成[schemaConfigName]对应的sql脚本本并创建数据库;\n'
  '\n\t6.npm run all [schemaConfigName]: ' +
  '\n\t\t清理输入目录后，生成[schemaConfigName]对应的sql脚本本并创建数据库;\n'
log.info(info)
