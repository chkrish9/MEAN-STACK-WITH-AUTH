var express = require('express');
var router = express.Router();

var Todo = require('../../models/todo');
var session = require('express-session');
//retriving todos
router.get('/todos/:email', (req, res, next) => {
    console.log(req.user);
    req.session.email=req.params.email;
    Todo.getTodos(req.params.email,(err, todos) => {
        res.json(todos);
    });
    //res.send('Redirected to Contant list');
});

//add todo
router.post('/todo', (req, res, next) => {
    //logic to add todo
    let newTodo = new Todo({
        email: req.body.email,
        task: req.body.task,
        isCompleted: req.body.isCompleted,
        isEditing: req.body.isEditing
    });
    Todo.addTodo(newTodo, (err, todo) => {
        if (err) {
            res.json({ msg: 'Failed while adding new contact', status: 'error' });
        } else {
            // res.json({ msg: 'new contact added successfully' });
           Todo.getTodos(todo.email,(err, todos) => {
                res.json(todos);
           });
        }
    });
});

//update todo
router.put('/todo/:id', function (req, res,next) {
    var id = req.params.id;
    var update = (req.body.task === undefined) ? { isCompleted : req.body.isCompleted }:{ task: req.body.task };
    Todo.updateTodo(id, update, (err, todo) => {
         if (err) {
            res.json({ msg: 'Failed while updating contact', status: 'error' });
        } else {
            // res.json({ msg: 'new contact added successfully' });
           Todo.getTodos(todo.email,(err, todos) => {
                res.json(todos);
           });
        }
    });
});

//delete todo
router.delete('/todo/:id/:email', (req, res, next) => {
    //logic to delete todo
    Todo.deleteTodo(req.params.id,(err, result) => {
        if (err) {
            res.json({ msg: 'Failed while deleting contact', status: 'error',success:false });
        } else {
           
            Todo.getTodos(req.session.email,(err, todos) => {
                    res.json(todos);
            });
        }
    })
});

module.exports = router;