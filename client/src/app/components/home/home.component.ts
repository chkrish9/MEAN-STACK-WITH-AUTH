import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../interfaces/todo';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todos:Todo[];
  task:string;
  params : {
        hasInput: false
  };

  constructor(private todoService : TodoService,private authService : AuthService) { }

  ngOnInit() {
    var user=JSON.parse(this.authService.loadUser());
    this.todoService.getTodos(user.email)
      .subscribe(todos => 
      this.todos = todos);
  };

  onEditClick = todo => {
      //console.log("edit click");
      todo.isEditing = true;
      todo.updatedValue = todo.task;
  };

  onDeleteClick = todo => {
      this.todoService.deleteTodo(todo._id,todo.email).subscribe(status=>{
        //console.log(success);
        if(status.success){
          this.todos = this.todos.filter(function(obj) {
              return todo._id != obj._id;
          });
        }
      }, error=>{
        console.log("Error occured at on save click method", error);
      });
  };
  updateTask = ($event,todo) =>{
    if($event !== "" && $event!==undefined && $event!==null)
      todo.updatedTask = $event;
  }
  onSaveClick = todo => {
      todo.task = todo.updatedTask;
      this.todoService.updateTodo(todo,false).subscribe(todos=>{
        //console.log(success);
        this.todos=todos;
      }, error=>{
        console.log("Error occured at on save click method", error);
      });
  };

  onCancelClick = todo => {
      todo.isEditing = false;
  };

  onCompletedTask = (todo) => {
     todo.isCompleted = ! todo.isCompleted;
     this.todoService.updateTodo(todo,true).subscribe(todos=>{
        //console.log(success);
        this.todos=todos;
      }, error=>{
        console.log("Error occured at on save click method", error);
      });
  }

  onAddClick = () => {
    if(this.task != undefined && this.task != "" && this.task != null){
      var user=JSON.parse(this.authService.loadUser());
      var newTodo={
        "email":user.email,
        "isCompleted":false,
        "task":this.task,
        "isEditing":false
      }
      this.todoService.addTodo(newTodo).subscribe(todos=>{
        //console.log(todos);
        this.todos=todos;
        this.task ="";
      }, error=>{
        console.log("Error occured at on add click method", error);
      });
    }
  };
}
