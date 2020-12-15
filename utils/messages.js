const { months } = require('moment')
const moment = require('moment')

function formatMessage(from_id, to_id, text){

    return{ 
        from_id,
        to_id,
        text,
        time: moment().format('dd/mm/yy h:mm a')
    }
}

module.exports = formatMessage