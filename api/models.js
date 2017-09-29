module.exports = function(mongoose) {
    var user = new mongoose.Schema({
        username : { type : String, required : true , unique: true },
        password : { type : String, required : true },
        email : { type : String, required : true },
        timezone :{ type : String, required : true },
        timestamp: { type: Date, default: Date.now }
    });
    
    var models = {
      Users : mongoose.model('users', user)
    };
    return models;
}