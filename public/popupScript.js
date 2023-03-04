const expirationMins = 10;

function initPopup(text) {
    const popupWrapper = document.createElement('div')
    popupWrapper.setAttribute('class', 'modal')
    popupWrapper.setAttribute('id', 'popup')
    popupWrapper.addEventListener('click', hidePopup)

    const content = document.createElement('div')
    content.setAttribute('class', 'modal-content')

    const confirmationButton = document.createElement('button')
    confirmationButton.addEventListener('click', handleConfirmation)
    confirmationButton.setAttribute('id', 'confirm')
    confirmationButton.innerHTML = "confirm"

    const message = document.createElement('div')
    message.innerHTML = "<h2>Please confirm that you read this.</h2>"
    const message2 = document.createElement('div');
    message2.setAttribute('id', 'message2')
    message2.innerHTML = text;

    const closeButton = document.createElement('span')
    closeButton.setAttribute('id', 'close')
    closeButton.innerHTML = "&times;"
    closeButton.addEventListener('click', hidePopup)

    content.appendChild(closeButton)
    content.appendChild(message)
    content.appendChild(message2)
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

function handleConfirmation(e) {
    // stop propagation to #popup which would trigger hidePopup()
    e.stopPropagation();

    fetch('/popup/confirmation', {
            method: 'POST'
        }
    ).then(async res => {
        const jsonResponse = await res.json();
        if (jsonResponse.confirmationTracked) {
            localStorage.setItem('popup_confirm_timestamp', Date.now().toString());
            hidePopup();
        }
    }).catch(console.error);
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

function displayPopup() {
    if (!isPopupRequired()) {
        return;
    }

    fetch('/popup').then(async res => {
        const jsonResponse = await res.json();
        if (jsonResponse.message) {
            initPopup(jsonResponse.message)
            showPopup()
        }
    }).catch(console.error);
}

document.addEventListener('DOMContentLoaded', function () {
    displayPopup();
}, false);