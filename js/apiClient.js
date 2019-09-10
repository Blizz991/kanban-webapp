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
        },
        error: function (xhr, status) {
            callback(null);
        }
    });
};

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

function postTask(modalId) {
    let modalEl = $(modalId);
    let modalInstance = M.Modal.getInstance(modalEl);

    let taskObj = {
        title: "This is a new task",
        userId: 4,
        kanbanColumnId: 1,
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt iure quaerat libero consequuntur mollitia quis excepturi fugiat fuga asperiores in officia dolores facere quidem, vero maxime placeat error nulla nam?",
        estimate: 3,
        deadline: "2019-10-17T05:30:12.278Z",
        priority: 2,
    };

    let jsonTask = JSON.stringify(taskObj);
    console.log(jsonTask);
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
        success: function () {
            console.log('Successfully added task to API');
            sendNotification('New task created!', 'green darken-3 white-text');
            // console.log(response);
        },
        error: function (xhr, status) {
            console.log('Failed adding task to API');
            sendNotification('There was an error creating the task', 'red darken-3 white-text');
            // console.log(response);
        }
    });

    modalInstance.close();
}