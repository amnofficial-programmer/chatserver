const { months } = require('moment')
const moment = require('moment')

function formatMessage(from, to, text){

    return{ 
        from,
        to,
        text,
        time: moment().format('dd/mm/yy h:mm a')
    }
}

module.exports = formatMessage