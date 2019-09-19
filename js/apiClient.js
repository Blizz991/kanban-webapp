function getColumns(callback) {
    $.ajax({
        url: "https://api.kanban.weibel.dev/api/KanbanColumns",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            let columnList = [];
            response.forEach(column => {
                columnList.push(KanbanColumn.fromJson(column));
            });
            console.log('Successfully pulled columns from API');
            callback(columnList);
        },
        error: function (xhr, status) {
            callback(null);
        }
    });
};


//Used for prototyping (User tests)
// function postTask(modalId) {
//     let modalEl = $(modalId);
//     let modalInstance = M.Modal.getInstance(modalEl);

//     let taskObj = {
//         title: $('#taskTitleInput').val(),
//         userId: $('#taskUserSelect').val(),
//         kanbanColumnId: 1, //Backlog
//         description: $('#taskDescriptionTextArea').val(),
//         estimate: $('#taskEstimateInput').val(),
//         deadline: (moment($('#taskDeadlineDateInput').val() + " " + $('#taskDeadlineTimeInput').val()).toISOString()),
//         priority: $('#taskPrioritySelect').val(),
//     };

//     let jsonTask = JSON.stringify(taskObj);
//     console.log(jsonTask);
//     $.ajax({
//         url: "https://api.kanban.weibel.dev/api/Task",
//         type: "POST",
//         crossDomain: true,
//         headers: {
//             "Accept": "application/json; charset=utf-8",
//             "Content-Type": "application/json; charset=utf-8"
//         },
//         data: jsonTask,
//         dataType: "json",
//         success: function () {
//             console.log('Successfully added task to API');
//             sendNotification('New task created!', 'green darken-3 white-text');
//             // console.log(response);
//         },
//         error: function (xhr, status) {
//             console.log('Failed adding task to API');
//             sendNotification('There was an error creating the task', 'red darken-3 white-text');
//             // console.log(response);
//         }
//     });

//     modalInstance.close();
// }

//#region Tasks CRUD
function addTask() {
    let taskObj = {
        title: "New task title",
        kanbanColumnId: 1, //Backlog
        description: "New task description",
        estimate: 0,
        // deadline: (moment($('#taskDeadlineDateInput').val() + " " + $('#taskDeadlineTimeInput').val()).toISOString()),
        priority: 6,
    };

    let jsonTask = JSON.stringify(taskObj);

    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task",
        type: "POST",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: jsonTask,
        dataType: "json",
        success: function (response) {
            //Add task to DOM
            sendNotification('Task added', "green darken-3 white-text");
        },
        error: function (xhr, status) {
            sendNotification(xhr.responseJSON + " try refreshing the page", "red darken-3 white-text", 10000);
        }
    });

}
function getTasks(callback) {
    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            let tasksList = [];
            response.forEach(task => {
                tasksList.push(Task.fromJson(task));
            });
            console.log('Successfully pulled tasks from API');
            callback(tasksList);

            //Initialize tooltips
            $('.tooltipped').tooltip();
        },
        error: function (xhr, status) {
            callback(null);
        }
    });
};

function updateTask(task) {
    let taskToUpdate = new Task(
        task.data('task-id'),
        task.find('[data-name="task-title"]').html(),
        task.parent('section').data('column-id'),
        $.trim(task.find('[data-name="task-content"]').html().replace('/\r?\n|\r/g', '')), //It was adding random new lines and 
        task.find('[data-name="task-estimate"]').html(),
        null, //Not being used currently
        task.find('[data-name="task-priority"]').html(),
        task.find('[data-name="task-timestamp"]').data('last-updated') //Timestamp of when the element was last edited
    );
    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task/" + taskToUpdate.Id,
        type: "PUT",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: JSON.stringify(taskToUpdate),
        success: function (response) {
            //Delete task from DOM
            task.find('[data-name="task-timestamp"]').data('last-updated', Task.fromJson(response).Timestamp);
            sendNotification('Task updated', "green darken-3 white-text");
        },
        error: function (xhr, status) {
            sendNotification(xhr.responseJSON + " try refreshing the page", "red darken-3 white-text", 10000);
        }
    });

}

function deleteTask(btn) {
    let task = $(btn).closest('section');

    let taskToUpdate = new Task(
        task.data('task-id'),
        task.find('[data-name="task-title"]').html(),
        task.parent('section').data('column-id'),
        $.trim(task.find('[data-name="task-content"]').html().replace('/\r?\n|\r/g', '')), //It was adding random new lines and 
        task.find('[data-name="task-estimate"]').html(),
        null, //Not being used currently
        task.find('[data-name="task-priority"]').html(),
        task.find('[data-name="task-timestamp"]').data('last-updated') //Timestamp of when the element was last edited
    );
    console.log(taskToUpdate);

    $.ajax({
        url: "https://api.kanban.weibel.dev/api/Task/" + taskToUpdate.Id,
        type: "DELETE",
        crossDomain: true,
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Content-Type": "application/json; charset=utf-8"
        },
        data: JSON.stringify(taskToUpdate),
        success: function (response) {
            task.remove();
            sendNotification('Task successfully deleted', "green darken-3 white-text");
        },
        error: function (xhr, status) {
            sendNotification("Task changed by another user, try refreshing the page", "red darken-3 white-text", 10000);
        }
    });
}

//#endregion Tasks CRUD