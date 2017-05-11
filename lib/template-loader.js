const fs = require('fs')

const templateLoader = {
  template4Field: '',
  template4Table: '',
  template4Schema: '',
  template4Uindex: '',
  run: function(templateFolder){
    // 读取字段模板文件
    this.template4Field = fs.readFileSync(templateFolder + '/field.sql', 'utf8')
    // 读取数据表创建模板文件
    this.template4Table = fs.readFileSync(templateFolder + '/table.sql', 'utf8')
    // 读取数据库创建模板文件
    this.template4Schema = fs.readFileSync(templateFolder + '/schema.sql', 'utf8')
    // 读取唯一索引创建模板文件
    this.template4Uindex = fs.readFileSync(templateFolder + '/uindex.sql', 'utf8')
  }
}

module.exports.TemplateLoader = templateLoader
