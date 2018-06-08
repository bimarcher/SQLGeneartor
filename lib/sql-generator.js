const fs = require('fs')

const log = require('./log').Log

const sqlGenerator = {
  generateBusinessFieldSql: function(template, table) {
    var sql = ''
    for (var i = 0; i < table.fields.length; i++) {
      var field = table.fields[i]
      var fieldSql = template
        .replace(/{{fieldName}}/g, field.name + ' ', '/g')
        .replace(/{{fieldType}}/g, field.type + ' ', '/g')
        .replace(/{{fieldNotNull}}/g, field.notNull + ' ', '/g')
        .replace(/{{fieldComment}}/g, field.comment, '/g')

      if (field.default) {
        fieldSql = fieldSql.replace(/{{fieldDefault}}/g, 'DEFAULT ' + field
          .default+' ', '/g')
      } else {
        fieldSql = fieldSql.replace(/{{fieldDefault}}/g, '', '/g')
      }
      sql += fieldSql
    }
    return sql
  },
  generateTableSql: function(template, schemaConfig, businessFieldSql, table) {
    log.info('\n\ttable ' + table.name + ' is create!')
    return template
      .replace(/{{tableAnnotation}}/g, table.annotation ? '\n' + table.annotation :
        '', '/g')
      .replace(/{{schemaName}}/g, schemaConfig.schemaName, '/g')
      .replace(/{{tableComment}}/g, table.comment, '/g')
      .replace(/{{tableName}}/g, table.name, '/g')
      .replace(/{{businessFileSql}}/g, businessFieldSql, '/g')
  },
  generateSchemaSql: function(template, schemaConfig) {
    return template
      .replace(/{{schemaName}}/g, schemaConfig.schemaName, '/g')
      .replace(/{{schemaComment}}/g, schemaConfig.schemaComment, '/g')
  },
  generateUindexSql: function(template, schemaConfig, table) {
    var sql = ''
    for (var i = 0; i < table['uindexFields'].length; i++) {
      var uindexField = table['uindexFields'][i]
      sql += template
        .replace(/{{schemaName}}/g, schemaConfig.schemaName, '/g')
        .replace(/{{tableName}}/g, table.name, '/g')
        .replace(/{{uindexField}}/g, uindexField, '/g')
    }
    return sql
  },
  run: function(sqlFile, template, schemaConfig) {
    return new Promise((resolve, reject) => {
      var sql = sqlGenerator.generateSchemaSql(template.template4Schema,
        schemaConfig)
      for (var i = 0; i < schemaConfig.tables.length; i++) {
        var table = schemaConfig.tables[i]
        var businessFieldSql = sqlGenerator.generateBusinessFieldSql(template.template4Field, table)
        sql += sqlGenerator.generateTableSql(template.template4Table,
          schemaConfig, businessFieldSql, table)
        sql += sqlGenerator.generateUindexSql(template.template4Uindex,
          schemaConfig, table)
      }
      const info = '\n\t-- ' + sqlFile + ' is saved!' + '\n\t-- ' +
        schemaConfig.tables.length + ' tables create sql is generated!\n';
      sql += info
  
      fs.writeFile(sqlFile, sql, function(err) {
        if (err) {
          reject('sqlGenerator:failure');
          throw err
        }
        log.info(info);
        resolve('success');
      })
    });
  }
}

module.exports.SQLGenerator = sqlGenerator
