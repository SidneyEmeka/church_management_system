const mongoose = require("mongoose");

const dbConnect = async() => {
try{
    const connect = await mongoose.connect(`${process.env.CONNECTION_STRING}`);
console.log(`DB CONNECTED ${connect.connection.host}, ${connect.connection.name},`);
return true;

}catch(err){
  console.log(`connection no work ooo ${err}`)
  return false;

};

}

module.exports = dbConnect;