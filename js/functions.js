function sendNotification(content, _classes, _displayLength = 4000) {
    M.toast({
        html: content,
        displayLength: _displayLength,
        classes: _classes
    });
}

function confirmCloseModal(modalId) {
    let modalEl = $(modalId);
    let modalInstance = M.Modal.getInstance(modalEl);

    let confirmed = confirm('Are you sure you wish to cancel?');
    if (confirmed == true) {
        modalInstance.close();
    }
}

function getPriorityClasses(priority) {
    let classes = "";
    switch (priority) {
        case priority <= 2:
            classes = "red darken-3";
            break;
        case priority > 2 && priority <= 4:
            classes = "yellow darken-3";
            break;
        case priority > 4 && priority <= 6:
            classes = "green darken-3";
            break;
        default: //In case a task has a wrongly assigned priority
            classes = "grey darken-1";
            break;
    }
    return classes;
}