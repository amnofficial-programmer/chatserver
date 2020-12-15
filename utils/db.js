var mysql      = require('mysql');
var async = require("async"); 
const moment = require('moment')
// var connection = mysql.createConnection({
//   host     : 'user-db-test.cyzboen9wiyg.ap-south-1.rds.amazonaws.com',
//   port     : '3306', 
//   user     : 'user_test',
//   password : 'Test_12345',
//   database : 'macrax_db'
// });


var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'user-db-test.cyzboen9wiyg.ap-south-1.rds.amazonaws.com',
  port     : '3306', 
  user     : 'user_test',
  password : 'Test_12345',
  database : 'macrax_db'
});
 
function connect(){
    if(connection.state === 'disconnected'){
        connection.connect();
    }
}

function disconnect(){
    connection.end();
}

function query(query){
    try{

        pool.query(query, function (error, results, fields) {
        if (error) throw error;
        console.log('The results  are: ', results);
        //console.log(error);
        });
        
    }catch(err){
        console.log(err);;
    }finally{
        
    }
    
}

function insert(message_id, from, to, text, time, status){
    try{
        let chat_table_ending = (parseInt(from) + parseInt(to)) % 10;
        let query = `INSERT into chat_data_${chat_table_ending}(message_id, from_id, to_id, time, text, status) values('${message_id}', ${from}, ${to}, '${text}', '${time}', '${status}')`
        console.log(query);
        pool.query(query, function (error, result) {
            if (error){
                console.log(error);
            }
            //console.log(`The data has been inserted into chat_data_${chat_table_ending}`, result);
        });
    }catch(err){
        console.log(err);;
    }finally{
       
    }   
}

function updateChatMessageStatus(message_id, from_id, to_id, status){
    try{
        let chat_table_ending = (parseInt(from_id) + parseInt(to_id)) % 10;
        let query = `UPDATE chat_data_${chat_table_ending} SET status='${status}' where message_id = '${message_id}'`;
        console.log(query);
        pool.query(query, function (error, result) {
            if (error){
                console.log(error);
            }
        });
    }catch(err){
        console.log(err)
    }
}

async function getHistoryChats(from ,to, callback){
    try{
        let chat_table_ending = (parseInt(from) + parseInt(to)) % 10;
        let query = `select * from chat_data_${chat_table_ending} where (from_id = ${from} and to_id = ${to}) or (from_id = ${to} and to_id = ${from}) `;
        console.log("executing query on db: ", query);
        await pool.query(query, function (error, result) {
            if (error){
                return callback(error, null);
            }
            finalResult = result;
            str=JSON.stringify(result);
            return callback(null, result);
        });
    }catch(error){
        return callback(error, result);
    }
}

// pool.on('acquire', function (connection) {
//     console.log('Connection %d acquired', connection.threadId);
// });

// pool.on('connection', function (connection) {
//     connection.query('SET SESSION auto_increment_increment=1')
// });

// pool.on('enqueue', function () {
//     console.log('Waiting for available connection slot');
// });

// pool.on('release', function (connection) {
//     console.log('Connection %d released', connection.threadId);
// });



module.exports = {
    connect,
    disconnect,
    query,
    insert,
    getHistoryChats,
    updateChatMessageStatus
}

