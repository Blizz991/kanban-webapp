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

function Task(Id, Title, UserId, KanbanColumnId, Description, Estimate, Deadline, Priority, Order, Timestamp) {
    this.Id = Id;
    this.Title = Title;
    this.UserId = UserId;
    this.KanbanColumnId = KanbanColumnId;
    this.Description = Description;
    this.Estimate = Estimate;
    this.Deadline = Deadline;
    this.Priority = Priority;
    this.Order = Order;
    this.Timestamp = Timestamp;
}

function KanbanColumn(Id, Name, Color, Order, Timestamp) {
    this.Id = Id;
    this.Name = Name;
    this.Color = Color;
    this.Order = Order;
    this.Timestamp = Timestamp;
}

function User(Id, Username, Image, Timestamp) {
    this.Id = Id;
    this.Username = Username;
    this.Image = Image;
    this.Timestamp = Timestamp;
}

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


function createNewTask() {

}

// #endregion Functions