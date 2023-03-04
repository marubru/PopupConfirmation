const expirationMins = 10;

function initPopup() {
    const popupWrapper = document.createElement('div')
    popupWrapper.setAttribute('class', 'modal')
    popupWrapper.setAttribute('id', 'popup')
    popupWrapper.addEventListener('click', hidePopup)

    const content = document.createElement('div')
    content.setAttribute('class','modal-content')
    
    const confirmationButton = document.createElement('button')
    confirmationButton.addEventListener('click', handleConfirmation)
    confirmationButton.setAttribute('id', 'confirm')
    confirmationButton.innerHTML = "confirm"

    const message = document.createElement('div')
    message.innerHTML = "<h2>Please confirm that you read this.</h2>"

    const closeButton = document.createElement('span')
    closeButton.setAttribute('id', 'close')
    closeButton.innerHTML = "&times;"
    closeButton.addEventListener('click', hidePopup)

    content.appendChild(closeButton)
    content.appendChild(message)
    content.appendChild(confirmationButton)
    popupWrapper.appendChild(content)

    document.body.appendChild(popupWrapper)
}

function showPopup() {
    document.querySelector('#popup').style.display = "block"
}

function hidePopup() {
    document.querySelector('#popup').style.display = "none"
}

function handleConfirmation() {
    localStorage.setItem('popup_confirm_timestamp', Date.now().toString());
    hidePopup()
}

function isPopupRequired() {
    const expiration = expirationMins * 60 * 1000;
    const lastConfirmationTimestamp = parseInt(localStorage.getItem('popup_confirm_timestamp'));

    // confirm button was not clicked yet
    if (!lastConfirmationTimestamp) {
        return true;
    }

    // if confirmation has expired, return true
    return lastConfirmationTimestamp + expiration < Date.now();
}

document.addEventListener('DOMContentLoaded', function(){
    if (isPopupRequired()) {
        initPopup()
        showPopup()
    }
}, false);