$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal();
    $('select').formSelect();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();

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

// #region Objects



// #endregion Objects

// #region Functions

function sendNotification(content, _displayLength, _classes) {
    M.toast({
        html: content,
        displayLength: _displayLength,
        classes: _classes
    });
}

function confirmCloseModal(modalId) {
    let modalEl = $(modalId);
    var modalInstance = M.Modal.getInstance(modalEl);

    var confirmed = confirm('Are you sure you wish to cancel?');
    if (confirmed == true) {
        modalInstance.close();
    }
}


function createNewTask(){

}

// #endregion Functions