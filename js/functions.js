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