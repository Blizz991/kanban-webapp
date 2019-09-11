$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    $('.modal').modal({
        dismissible: false,
        endingTop: '2%'
    });
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();

    getColumns(function (columnList) {
        if (columnList !== null) {
            // console.log(columnList);
            // columnList = columnList.sort(function (a, b) { return a.Order - b.Order });
            // console.log(columnList);
            columnList.forEach(column => {
                let columnFromTemplate = $('#tasksColumnTemplate').html()
                    .replace('##tasksColumnID##', column.Id)
                    .replace('##tasksColumnTitle##', column.Name)
                    .replace('##tasksColumnClasses##', column.Color);
                // .replace('##taskEstimate##', column.Order)
                // .replace('##taskTimestamp##', column.Timestamp);
                $(columnFromTemplate).appendTo($('#mainColumnContainer'));
                // console.log(columnFromTemplate);
            });
            //TODO: Order before appending
            $('.tasks__row').sortable({
                group: 'row',
                animation: 250,
                ghostClass: 'grey',
                handle: ".row-drag-handle"
            });
        
            $('.tasks__column').sortable({
                swapThreshold: 1,
                // invertSwap: true,
                group: 'column',
                animation: 250,
                ghostClass: 'grey',
                handle: ".column-drag-handle"
            });
        }
        else {
            alert('Column API call failed');
        }
    });

    getTasks(function (tasksList) {
        if (tasksList !== null) {
            // console.log(tasksList);
            tasksList.forEach(task => {
                let taskFromTemplate = $('#taskTemplate').html()
                    .replace('##taskID##', task.Id)
                    .replace('##taskTitle##', task.Title)
                    .replace('##taskContent##', task.Description)
                    .replace('##taskEstimate##', task.Estimate)
                    // .replace('##taskDeadline##',  moment(task.Deadline).format("Do of MMM. YY, hh:mm A"))
                    .replace('##taskDeadline##', moment(task.Deadline).format("Do of MMM. YY")) //Use above once tooltip works
                    .replace('##taskPriority##', task.Priority)
                // .replace('##taskTimestamp##', task.Timestamp);
                let columnId = '#tasksColumn-' + column.KanbanColumnId;
                $(columnFromTemplate).appendTo($(columnId));
                $(taskFromTemplate).appendTo($('#tasksBacklogColumn'));
            });
        } else {
            alert('Task API call failed');
        }
    });

    $('.tooltipped').tooltip();
    // sendNotification('Hello world!', 1000, 'green');
});