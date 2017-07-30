const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    task :{
        type: String,
        required:true
    },
    isCompleted :{
        type: Boolean
    },
    isEditing :{
        type: Boolean 
    }
});

const Todo = module.exports = mongoose.model('Todo', TodoSchema);

//Get todos
module.exports.getTodos = function(email,callback){
    Todo.find({email:email},callback);
}

//Add todo
module.exports.addTodo = function(newTodo, callback){
    newTodo.save(callback);
}

//Update todo
module.exports.updateTodo = function(id,updateQuery, callback){
    Todo.findByIdAndUpdate(id,{ $set: updateQuery },callback);
}

//Delete todo
module.exports.deleteTodo = function(id,callback){
    Todo.remove({ _id: id },callback);
}