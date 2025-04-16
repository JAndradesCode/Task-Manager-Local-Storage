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

//Add new task function ///////////////////////////////////////////////////////////////////////////
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

//Save tasks to local storage function
function saveTask(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

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

//Render tasks function ////////////////////////////////////////////////////////////////////////
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

//Update task count function
function updateTaskCounts(){
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(function(task){
        return task.completed;
    }).length;
    taskCountElement.textContent=`Total : ${totalTasks}`;
    completedCountElement.textContent=`Completed: ${completedTasks}`;
}

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