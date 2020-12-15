function getRoomId(from_id, to_id){
    var f = parseInt(from_id);
    var t = parseInt(to_id);
  
    var room = null;
    if(f < t){
      room = from_id + to_id;
    }else{
      room =  to_id + from_id ;
    }
    return room;
  }

  module.exports = {
    getRoomId
}

