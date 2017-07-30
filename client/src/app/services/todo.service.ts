import { Injectable } from '@angular/core';
import { Http, Headers,RequestOptions } from '@angular/http';
import { Todo } from '../interfaces/todo';
import 'rxjs/add/operator/map';

@Injectable()
export class TodoService {
  isDev:boolean;
  constructor(private http: Http) { 
    this.isDev = false;
  }

  //retriving todo service

  getTodos(email) {
   let url = this.prepEndpoint('todo/todos/');
   url = url+email;
   return this.http.get(url)
      .map(res => res.json());
  }
  

  //add todo
  addTodo(newTodo) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = this.prepEndpoint('todo/todo');
    return this.http.post(url, newTodo, options)
      .map(res => res.json());
  
  }

  //update todo
  updateTodo(todo, editIsCompleted){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = this.prepEndpoint('todo/todo/');
    url = url+`${todo._id}`;
    var update = (editIsCompleted === true) ? {	"isCompleted" : todo.isCompleted } :{	"task" : todo.task };
    return this.http.put(url,update, {headers: headers})
      .map(res => res.json());
  }

  //delete todo
  deleteTodo(id,email) {
    let url = this.prepEndpoint('todo/todo/');
    return this.http.delete(url + id+'/'+email)
      .map(res => res.json());
  }

  prepEndpoint(ep){
    if(!this.isDev){
      return ep;
    } else {
      return 'http://localhost:3000/'+ep;
    }
  }
}