$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal({
        dismissible: false,
        endingTop: '2%'
    });
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();

    getTasks(function (tasksList) {
        if (tasksList !== null) {
            console.log(tasksList);
            tasksList.forEach(task => {
                let taskFromTemplate = $('#taskTemplate').html()
                    .replace('##taskID##', task.Id)
                    .replace('##taskTitle##', task.Title)
                    .replace('##taskContent##', task.Description)
                    .replace('##taskEstimate##', task.Estimate)
                    .replace('##taskDeadline##', task.Deadline)
                    .replace('##taskPriority##', task.Priority)
                    .replace('##taskTimestamp##', task.Timestamp);
                $(taskFromTemplate).appendTo($('#tasksBacklogColumn'));
            });
        } else {
            alert('API call failed');
        }

    });

    $('.tasks__row').sortable({
        group: 'row',
        animation: 250,
        ghostClass: 'grey',
        handle: ".row-drag-handle"
    });

    $('.tasks__column').sortable({
        swapThreshold: 1,
        invertSwap: true,
        group: 'column',
        animation: 250,
        ghostClass: 'grey',
        handle: ".column-drag-handle"
    });

    // sendNotification('Hello world!', 1000, 'green');
});