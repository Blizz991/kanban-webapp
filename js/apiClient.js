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



