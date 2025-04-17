# Task Manager Code Explanation
This document provides a detailed explanation of the Task Manager web application. The application is a simple but complete task management system built with HTML, CSS, and JavaScript.

## Table of Contents
1. [HTML Structure](#html-structure)
2. [CSS Styling](#css-styling)
3. [JavaScript Functionality](#javascript-functionality)
4. [Data Management](#data-management)
5. [Event Handling](#event-handling)

## HTML Structure
The HTML structure defines the user interface of the Task Manager application:
```HTML 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager w/ Local Storage</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Task Manager</h1>

        <div class="input-section">
            <input type="text" id="task-input" placeholder="Add a new task...">
            <button id="add-button">Add</button>
        </div>

        <ul id="task-list">
            <!--tasks will be added here dynamically-->
        </ul>

        <div id="no-tasks" class="no-tasks">
            <i>No tasks yet... Add a task to get started.</i>
        </div>

        <div class="status-bar">
            <span id="tasks-count">Total : 0 tasks</span>
            <span id="completed-count">Completed : 0 tasks</span>
        </div>

        <button id="clear-all" class="clear-all" onclick="clearAllTasks()">Clear All Tasks</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
```
Key HTML Components:
- A container `div` that wraps the entire application
- A heading that displays the title
- An input section with a text field and an "Add" button
- An empty unordered list (`ul`) where tasks will be displayed
- A message that shows when there are no tasks
- A status bar showing task counts
- A "Clear All Tasks" button

## CSS Styling
The CSS styling defines the visual apperance of the task manager.
```CSS
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}
body {
    background-color: #f5f5f5;
    padding: 20px;
}
.container{
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}
h1{
    text-align: center;
    margin-bottom: 15px;
}
button{
    border: 1px solid #888;
    border-radius: 1px;
}
button:hover{
    border: 2px solid black;
}
.input-section{
    display: flex;
    margin-bottom: 20px;
}
#task-input{
    flex: 1;
    padding: 10px;
    font-size: 16px;
}
#add-button{
    padding: 10px 15px;
    color: white;
    background-color: #4CAF50;
    cursor: pointer;
}
.clear-all{
    display: block;
    width: 100%;
    margin-top: 20px;
    padding: 5px;
    cursor: pointer;
    color: white;
    background-color: #ff9800;
    font-size: 16px;
}
.no-tasks{
    text-align: center;
    color: #888;
    padding: 20px 0;
}
.status-bar{
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    padding-top: 15px;
    font-size: 16px;
}
#task-list{
    list-style-type: none;
}
.task-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #f9f9f9;
    margin-bottom: 8px;
}
.task-text{
    flex:1;
    margin-left: 10px;
}
.completed{
    text-decoration: line-through;
    color:#888;
}
.delete-btn{
    color: white;
    background-color: #f44336;
    cursor: pointer;
    margin-left: 10px;
    padding: 5px 10px;
}
```
Key CSS features:
1. **Reset styles**: sets default margins, padding, and box-sizing for all elements.
2. **Container styling**: creates a centered, white card with rounded corners and subtle shadow.
3. **Input section**: uses flexbox to position the input field and "**Delete**" button side by side.
4. **Task items**: styles each task with background color, spacing, and flexbox layout.
5. **Button styles**: defines appearance for "Add," "Delete," and "Clear All" buttons.
6. **Status indicator**: styles for completed tasks (strikethrough).
7. **Responsive design**: uses relative units and max-width properties to ensure responsive behavior.

## JavaScript Functionality
The JavaScript code handles all the dynamic behavior of the Task Manager application:
### DOM Elements
```JavaScript
//DOM elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const noTasksMessage = document.getElementById('no-tasks');
const clearAllBtn = document.getElementById('clear-all');
const taskCountElement = document.getElementById('tasks-count');
const completedCountElement = document.getElementById('completed-count');

//Task data array
let tasks=[];
```
This section selects all the necessary DOM elements that will be manipulated and initializes an empty task array.

### Data Management
```javascript
//Load tasks from local storage function
function loadTasks(){
    //try to get tasks from local storage
    const savedTask = localStorage.getItem("tasks");

    //if tasks exist in local storage, parse them into the tasks array
    if(savedTask){
        tasks = JSON.parse(savedTask);
        renderTasks();
    }
}

//Save tasks to local storage function
function saveTask(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
```
These functions handle persistant storage:
- `loadTasks()` : retrieves tasks from localStorage when the page loads.
- `saveTask()` : saves the current tasks to localStorage whenever changes are made.
### Task Operations
```javascript
//Add task function
function addTask(){
    const taskText = taskInput.value.trim();
    //check if task is not empty
    if(taskText){
        //create a new task object
        const newTask={
            id:Date.now(), //generate a unique id using timestamp 
            text:taskText,
            completed:false,
            createdAt:new Date().toISOString()
        }
        //Add task to array
        tasks.push(newTask);
        //Save to local storage
        saveTask();
        //clear input
        taskInput.value="";
        //Update UI
        renderTasks();
    }
}

//Delete task function
function deleteTask(taskId){
    //filter out the task with the given ID
    tasks = tasks.filter(function(task){
        return task.id !== taskId;
    });
    //save updated task to local storage
    saveTask();
    //update UI
    renderTasks();
}

//Toggle task completion function
function toggleTaskCompletion(taskId){
    //find task in the array
    for(let i=0; i<tasks.length; i++){
        if(tasks[i].id === taskId){
            //toggle completed status
            tasks[i].completed =!tasks[i].completed;
            break;
        }
    }
    //save updated tasks to local storage
    saveTask();
    //update UI
    renderTasks();
}

//Clear all tasks function
function clearAllTasks(){
    //confirm before clearing
    if(tasks.length>0){
        const confirmed = confirm("Are you sure you want to delete all tasks?");
        if(confirmed){
            tasks=[];
            saveTask();
            renderTasks();
        }
    }
}
```
These functions implement the core task operations:
- `addTask()` : creates a new task object, adds it to the array, and updates the UI
- `deleteTask()` : Removes a specific task by ID using array filtering.
- `toggleTaskCompletion(taskId)` : Toggles the completed status of a task.
- `clearAllTasks()` : Removes all tasks after confirmation.

### UI Rendering
```javascript
//Render tasks to UI function
function renderTasks(){
    //clear current list
    taskList.innerHTML='';

    //show/hide the no tasks message
    if(tasks.length===0){
        noTasksMessage.style.display="block";
    }
    else{
        noTasksMessage.style.display="none";
    }

    //create task elements
    tasks.forEach(function(task){
        //create list items
        const li = document.createElement("li");
        li.className="task-item";

        //create checkbox
        const checkbox = document.createElement("input");
        checkbox.type='checkbox';
        checkbox.checked=task.completed;
        //add eventlistener
        checkbox.addEventListener("change", function(){
            //call toggleTaskCompletion(task.id);
            toggleTaskCompletion(task.id);
        });

        //create task text span
        const span = document.createElement("span");
        span.className=task.completed ? 'task-text completed' : 'task-text';
        span.textContent=task.text;

        //create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className='delete-btn';
        deleteBtn.textContent='Delete';
        //add eventlistener
        deleteBtn.addEventListener("click", function(){
            deleteTask(task.id);
        });

        //add elements
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    //update task count
    updateTaskCounts();
}

//Update task count function
function updateTaskCounts(){
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(function(task){
        return task.completed;
    }).length;
    taskCountElement.textContent=`Total : ${totalTasks}`;
    completedCountElement.textContent=`Completed: ${completedTasks}`;
}
```
These functions handle UI updates:
- `renderTasks()` : Recreates the entire task list in the DOM, based on the current data.
- `updateTaskCounts()` : Calculates and displays the total and completed task counts.

### Event Handling
```javascript
//Add event listeners
//Add button
addBtn.addEventListener("click", addTask);

//Add when Enter is pressed
taskInput.addEventListener("keypress", function(e){
    //add task when Enter key is pressed
    if(e.key === "Enter"){
        addTask();
    }
});

//initialize page
loadTasks();
```
The final section sets up eventListeners:
- Click handler for the "Add" button
- Keypress handler for the "Enter" key in the input field
- Initial call to `loadTasks()` to load tasks when page loads

## Data Management
The application uses a simple but effective data structure:
1. **Task Object Structure** : 
    ```javascript
        {
            id:Date.now(), //generate a unique id using timestamp 
            text:taskText,
            completed:false,
            createdAt:new Date().toISOString()
        }
    ```
2. **Storage Method** :
    - The application uses `localStorage` for persistent storage
    - Tasks are stored as a JSON string and parsed back to an array when needed
    - This allows tasks to persist even when the browser is closed and reopened

## Event Flow
The typical flow of operation is:
1. User adds a task -> `addTask()` -> `saveTask()` -> `renderTasks()`
2. User toggles completion -> `toggleTaskCompletion()` -> `saveTask()` -> `renderTasks()`
3. User deletes a task -> `deleteTask()` -> `saveTask()` -> `renderTasks()`
4. User clears all tasks -> `clearAllTasks()` -> `saveTask()` -> `renderTasks()`

This pattern ensures that:
1. The data model (tasks array) is updated first
2. Changes are persisted to localStorage
3. UI is updated to reflect the current state