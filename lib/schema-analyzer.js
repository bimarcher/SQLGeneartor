const fs = require('fs')
const readline = require('readline')

const log = require('./log').Log

const schemaAnalyzer = {
  config: {
    schemaComment: '',
    schemaName: '',
    tables: []
  },
  template: '',
  confFile: '',
  sqlFolder: '',
  schemaConfigFile: '',
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
  run: function(confFile, schemaConfigFile, sqlFolder, template, generator){
    this.template = template
    this.confFile = confFile
    this.sqlFolder = sqlFolder
    this.schemaConfigFile = schemaConfigFile
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
          throw new Error(this.confFile + '中，本行(' + lineNo + ')表示schema定义，格式为:schemaName#schemaComment')
        }
        this.config['schemaName'] = schemaInfo[0].trim()
        this.config['schemaComment'] = schemaInfo[1].trim()
        this.config['annotation'] = annotation
        annotation = ''
      }else if(level == 1){
        const tableInfo = lineTrim.split(this.separatorStr)
        if(tableInfo.length != 2 && tableInfo.length != 3){
          throw new Error(this.confFile + '中，本行(' + lineNo + ')表示table定义，格式为:tableName # tableComment # tableUindexFields')
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
          throw new Error(this.confFile + '中，本行(' + lineNo + ')表示字段定义，格式为:fieldName#fieldComment')
        }
        field = {}
        field['name'] = fieldInfo[0].trim()
        field['comment'] = fieldInfo[1].trim()
        table['fields'].push(field)
      }else if(level == 3){
        const fieldDef = lineTrim.split(this.separatorStr4fieldDef)
        if(fieldDef.length != 2 && fieldDef.length != 3){
          throw new Error(this.confFile + '中，本行(' + lineNo + ')表示字段定义，格式为:fieldType|fieldNotNull|fieldDefault')
        }
        field['type'] = fieldDef[0].trim().toUpperCase()
        if(fieldDef[1].trim() == 'y'){
          field['notNull'] = 'NOT NULL'
        }else{
          field['notNull'] = 'NULL'
        }
        if(fieldDef.length == 3){
          const fieldDefault = fieldDef[2].trim()
          field['default'] =  fieldDefault== 'none' || fieldDefault == 'n' || fieldDefault == '' ? '' : fieldDef[2].replace(/default/, '').trim()
        }else{
          field['default'] = ''
        }
      }
    }).on('close', () => {
      const schemaConfigFile = this.schemaConfigFile
      fs.writeFile(schemaConfigFile, 'module.exports = ' + JSON.stringify(this.config), function (err) {
          if (err) throw err
          log.info('\n\t' + schemaConfigFile + ' is saved!')
      })
      if(generator && generator.run){
        generator.run(this.sqlFolder, this.template, this.config)
      }
    })
  }
}

module.exports.SchemaAnalyzer = schemaAnalyzer
