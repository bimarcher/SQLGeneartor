const fs = require('fs')
const readline = require('readline')

const log = require('./log').Log

const template = {
  template4Field: '',
  template4Table: '',
  template4Schema: '',
  template4Uindex: '',
  init: function(){
    // 读取字段模板文件
    this.template4Field = fs.readFileSync('./template/field.sql', 'utf8')
    // 读取数据表创建模板文件
    this.template4Table = fs.readFileSync('./template/table.sql', 'utf8')
    // 读取数据库创建模板文件
    this.template4Schema = fs.readFileSync('./template/schema.sql', 'utf8')
    // 读取唯一索引创建模板文件
    this.template4Uindex = fs.readFileSync('./template/uindex.sql', 'utf8')
  }
}
const generator = {
  generateBusinessFieldSql: function(template, table){
    var sql = ''
    for (var i=0; i < table.fields.length; i++ ){
      var field = table.fields[i]
      var fieldSql = template
              .replace(/{{fieldName}}/g, field.name + ' ', '/g')
              .replace(/{{fieldType}}/g, field.type + ' ', '/g')
              .replace(/{{fieldNotNull}}/g, field.notNull + ' ', '/g')
              .replace(/{{fieldComment}}/g, field.comment, '/g')

      if (field.default) {
        fieldSql = fieldSql.replace(/{{fieldDefault}}/g, 'DEFAULT ' + field.default + ' ', '/g')
      }else{
        fieldSql = fieldSql.replace(/{{fieldDefault}}/g, '', '/g')
      }
      sql += fieldSql
    }
    return sql
  },
  generateTableSql: function(template, schemaConfig, businessFieldSql, table){
    log.info('table ' + table.name + ' is create!')
    return template
              .replace(/{{tableAnnotation}}/g, table.annotation ? '\n' + table.annotation :'', '/g')
              .replace(/{{schemaName}}/g, schemaConfig.schemaName, '/g')
              .replace(/{{tableComment}}/g, table.comment, '/g')
              .replace(/{{tableName}}/g, table.name, '/g')
              .replace(/{{businessFileSql}}/g, businessFieldSql, '/g')
  },
  generateSchemaSql: function(template, schemaConfig){
    return template
              .replace(/{{schemaName}}/g, schemaConfig.schemaName, '/g')
              .replace(/{{schemaComment}}/g, schemaConfig.schemaComment, '/g')
  },
  generateUindexSql: function(template, schemaConfig, table){
    var sql = ''
    for (var i=0; i < table['uindexFields'].length; i++ ){
      var uindexField = table['uindexFields'][i]
      sql += template
              .replace(/{{schemaName}}/g, schemaConfig.schemaName, '/g')
              .replace(/{{tableName}}/g, table.name, '/g')
              .replace(/{{uindexField}}/g, uindexField, '/g')
    }
    return sql
  },
  run: function(schemaConfig){
    template.init()
    var sql = this.generateSchemaSql(template.template4Schema, schemaConfig)
    for (var i = 0; i < schemaConfig.tables.length; i++) {
      var table = schemaConfig.tables[i]
      var businessFieldSql = this.generateBusinessFieldSql(template.template4Field, table)
      sql += this.generateTableSql(template.template4Table, schemaConfig, businessFieldSql, table)
      sql += this.generateUindexSql(template.template4Uindex, schemaConfig, table)
    }
    fs.writeFile('./sql/' + schemaConfig.schemaName + '.sql', sql, function (err) {
        if (err) throw err
        log.info('./sql/' + schemaConfig.schemaName + '.sql is saved! ' + schemaConfig.tables.length + ' tables' )
    })
  }
}

const schema = {
  config: {
    schemaComment: '',
    schemaName: '',
    tables: []
  },
  confFile: './conf/schema.conf',
  indentStr: '  ',
  separatorStr: '#',
  separatorStr4fieldDef: '|',
  separatorStr4Annotation: '--',

  countIndent: function(line){
    const regExp = new RegExp('^' + this.indentStr + '+');
    const regExp1 = new RegExp(this.indentStr, 'g');
    const res = regExp.exec(line)
    if(res){
      return res[0].match(regExp1).length
    }
    return 0
  },
  analyze: function(generator){
    let lineNo = 0
    let table, field, annotation

    const read = readline.createInterface({
      input: fs.createReadStream(this.confFile, 'utf8')
    })

    read.on('line', (line) => {
      lineNo++
      const lineTrim = line.trim()
      // 空行
      if(lineTrim.length==0) return
      // 注释行
      if (lineTrim.indexOf(this.separatorStr4Annotation) == 0) {
        annotation = lineTrim
        return
      }
      const level = this.countIndent(line)
      if(level == 0){
        const schemaInfo = lineTrim.split(this.separatorStr)
        if(schemaInfo.length != 2){
          throw new Error('本行表示schema定义，格式为:schemaName#schemaComment')
        }
        this.config['schemaName'] = schemaInfo[0].trim()
        this.config['schemaComment'] = schemaInfo[1].trim()
        this.config['annotation'] = annotation
        annotation = ''
      }else if(level == 1){
        const tableInfo = lineTrim.split(this.separatorStr)
        if(tableInfo.length < 2){
          throw new Error('本行表示table定义，格式为:tableName # tableComment # tableUindexFields')
        }
        table = {}
        table['annotation'] = annotation
        annotation = ''
        table['name'] = tableInfo[0].trim(),
        table['comment'] = tableInfo[1].trim(),
        table['uindexFields'] = tableInfo.length > 2 ? tableInfo[2].trim().split(',') : []
        table['fields'] = []
        this.config['tables'].push(table)
      }else if(level == 2){
        const fieldInfo = lineTrim.split(this.separatorStr)
        if(fieldInfo.length != 2){
          throw new Error('本行表示字段定义，格式为:fieldName#fieldComment')
        }
        field = {}
        field['name'] = fieldInfo[0].trim()
        field['comment'] = fieldInfo[1].trim()
        table['fields'].push(field)
      }else if(level == 3){
        const fieldDef = lineTrim.split(this.separatorStr4fieldDef)
        if(fieldDef.length != 3){
          throw new Error('本行表示字段定义，格式为:fieldType|fieldDefault|fieldNotNull')
        }
        field['type'] = fieldDef[0].trim().toUpperCase()
        field['default'] = fieldDef[1].trim() == 'none' || fieldDef[1].trim() == 'n' ? '' : fieldDef[1].replace(/default/, '').trim()
        if(fieldDef[2].trim() == 'y'){
          field['notNull'] = 'NOT NULL'
        }else{
          field['notNull'] = 'NULL'
        }
      }
    }).on('close', () => {
      fs.writeFile('./conf/schema-config.js', 'module.exports = ' + JSON.stringify(this.config), function (err) {
          if (err) throw err
          log.info('./conf/schema-config.js is saved!')
      })
      if(generator&&generator.run){
        generator.run(this.config)
      }
    });
  }
}

schema.analyze(generator);
