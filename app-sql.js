const fs = require('fs')

const log = require('./lib/log').Log

const template = require('./lib/template').Template

const schemaAnalyzer = require('./lib/schema-analyzer').SchemaAnalyzer

const sqlGenerator = require('./lib/sql-generator').SQLGenerator

const generator = {
  run: function(schemaConfig){
    template.init('./template')
    var sql = sqlGenerator.generateSchemaSql(template.template4Schema, schemaConfig)
    for (var i = 0; i < schemaConfig.tables.length; i++) {
      var table = schemaConfig.tables[i]
      var businessFieldSql = sqlGenerator.generateBusinessFieldSql(template.template4Field, table)
      sql += sqlGenerator.generateTableSql(template.template4Table, schemaConfig, businessFieldSql, table)
      sql += sqlGenerator.generateUindexSql(template.template4Uindex, schemaConfig, table)
    }
    fs.writeFile('./sql/' + schemaConfig.schemaName + '.sql', sql, function (err) {
        if (err) throw err
        log.info('\n\t./sql/' + schemaConfig.schemaName + '.sql is saved!\n\t' + schemaConfig.tables.length + ' tables is created!' )
    })
  }
}

schemaAnalyzer.run('./conf/schema.conf', './conf/schema-config.js', generator);
