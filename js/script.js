const taskInput = document.getElementById("task-value");
const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementsByClassName("edit-btn");
const deleteBtn = document.getElementsByClassName("delete-btn");
const taskName = document.getElementsByClassName("task-name");
const taskDone = document.getElementsByClassName("task-done");
const taskList = document.getElementById("task-list");

const errorMessage = document.createElement("div");
errorMessage.classList.add("invalid-feedback");

function addTask() {
    value = taskInput.value;
    let task = JSON.parse(localStorage.getItem("Tasks") || "[]");
    if(!value) {
        taskInput.classList.add("is-invalid");
        errorMessage.innerText = `Can't Enter Empty Task.`;
        taskInput.nextElementSibling.insertAdjacentElement("afterend", errorMessage);
    }
    else if(task.includes(value)) {
        taskInput.classList.add("is-invalid");
        errorMessage.innerText = `The Task Already Exists.`;
        taskInput.nextElementSibling.insertAdjacentElement("afterend", errorMessage);
    }
    else {
        taskInput.classList.remove("is-invalid");
        errorMessage.remove();
        task = [...task, value]
        localStorage.setItem("Tasks",JSON.stringify(task));

        taskInput.value = "";
        showTasks();
    }
}

function deleteTask(e) {
    let taskValue = e.parentElement.previousElementSibling.children[1].innerText;
    let tasks = JSON.parse(localStorage.getItem("Tasks"));
    localStorage.setItem("Tasks", JSON.stringify(tasks.filter(task => task != taskValue)));
    e.parentElement.parentElement.remove();
    showTasks();
}

async function editTask(e) {
    let taskValue = e.parentElement.previousElementSibling.children[1];
    let tasks = JSON.parse(localStorage.getItem("Tasks"));
    const newValue = await getEditedTask(taskValue.innerText, tasks);
    let index = tasks.indexOf(taskValue.innerText);
    tasks.splice(index, 1, newValue);
    localStorage.setItem("Tasks", JSON.stringify(tasks));
    showTasks();
}

async function getEditedTask(currentValue, tasks) {
    let counter = 0;
    const editedTask = await Swal.fire({
        title: "<h1>Edit Task</h1>",
        input: "text",
        inputLabel: "Task Name",
        inputValue: currentValue,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Can't Enter Empty Task.";
            }
        }
    })
    if(editedTask.value) {
        tasks.forEach(task => {
            if(task == editedTask.value)
                counter++;
        });
        if(counter == 1) {
            Swal.fire("Changes are not saved", "Task Already Exists.", "error");
            return currentValue;
        } 
        else {
            Swal.fire("Saved!", "Task Edited Successfully.", "success");
            return editedTask.value;
        }
    }
    else
        Swal.fire("Changes are not saved", "You Cancelled.", "info");
        return currentValue;
}


addBtn.addEventListener("click", addTask);

document.addEventListener("click", (e)=>{
    if(e.target.classList.contains("delete-btn")) {
        deleteTask(e.target);
    };

    if(e.target.classList.contains("edit-btn")) {
        editTask(e.target);
    };

    if(e.target.classList.contains("task-done")) {
        const Task = e.target.parentElement.nextElementSibling;
        const taskEditBtn = e.target.parentElement.parentElement.parentElement.children[1].children[0];
        Task.classList.toggle("done");
        if(e.target.checked == true) 
            taskEditBtn.disabled = true;
        else 
            taskEditBtn.disabled = false;
        
    };
});


function showTasks() {
    taskList.innerHTML = ``;
    const tasks = JSON.parse(localStorage.getItem("Tasks") || "[]");
    if(tasks.length > 0) {
        tasks.forEach(task => {
            taskList.innerHTML += 
            `
                        <div class="container task">
                    <div class="input-group mb-3 border border-3 border-warning rounded-3 d-flex flex-column flex-sm-row justify-content-between">
                        <div class="d-flex">
                        <div class="input-group-text">
                            <input class="form-check-input mt-0 p-2 task-done" type="checkbox" value="" aria-label="Task Ended">
                        </div>  
                        <h3 class="ps-3 pt-2 text-center task-name">${task}</h3>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-outline-success rounded-0 fw-bold edit-btn" type="button">Edit</button>
                            <button class="btn btn-outline-danger rounded-0 fw-bold delete-btn" type="button">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    else {
        taskList.innerHTML = `<h1>No Tasks To Show.</h1>` 
    }
}

showTasks();    