const moment = require("moment")

const log = {
  prefix: function(){
    return '@ log by archer @ ' + moment().format('YYYY-MM-DD HH:mm:ss:SSS' + ' : ' )
  },
  info: function(info){
    console.log(this.prefix() + info)
  }
}
module.exports.Log = log
