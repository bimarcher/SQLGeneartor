
const log = require('./lib/log').Log

const template = require('./lib/template-loader').TemplateLoader

const schemaAnalyzer = require('./lib/schema-analyzer').SchemaAnalyzer

const sqlGenerator = require('./lib/sql-generator').SQLGenerator

template.run('./template')
schemaAnalyzer.run('./conf/schema.conf', './conf/schema-config.js', './output/', template, sqlGenerator);
