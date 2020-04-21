function getParentElementWithClass(element, targetClassname) {
  const parent = element.parentElement;
  if (parent.classList.contains(targetClassname)) {
    return parent;
  }
  return getParentElementWithClass(parent, targetClassname);
}

class MessageHandler {
  messageTemplate = document.getElementById("template");
  messageList = document.querySelector(".messages");
  userName = document.getElementById("name");
  textarea = document.querySelector(".comment-field");
  submitBtn = document.querySelector(".submit");
  url = "http://localhost:3000/messages";

  submitNewMessage() {
    const data = this.getFormData();

    fetch(this.url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        return fetch(this.url);
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        // TODO: implement rendering single message, not all
        this.renderMessages(data);
      })
      .catch(err => console.error(err));
  }
  getFormData() {
    const formData = {};
    formData.sender = this.userName.value;
    formData.text = this.textarea.value;
    formData.addedAt = new Date().toString();
    return formData;
  }
  updateMessage(messageData) {
    fetch(this.url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(messageData),
    })
      .then(() => {
        return fetch(this.url);
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        // TODO: implement rendering single message, not all
        this.renderMessages(data);
      })
      .catch(error => console.error(error));
  }
  fetchAllMessages() {
    fetch("http://localhost:3000/messages")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.renderMessages(data);
      })
      .catch(err => console.error(err));
  }
  retrieveDataFromMessage(message) {
    const messageId = message.querySelector("input[data-id]").value;
    const messageAuthor = message.querySelector("input[data-author]").value;
    const messageComment = message.querySelector("input[data-comment]").value;
    return {
      id: messageId,
      sender: messageAuthor,
      text: messageComment,
    };
  }
  editMessage({ messageElem, data }) {
    const self = this;
    const comment = messageElem.querySelector(".message__comment");
    const btnSection = messageElem.querySelector(".message__buttons");
    const textArea = document.createElement("textarea");
    const saveBtn = document.createElement("button");
    const isTextAreaAlreadyExist = messageElem.querySelector(
      ".message__textarea-edit",
    );
    if (isTextAreaAlreadyExist) {
      return;
    }

    textArea.classList.add("message__textarea-edit");
    textArea.value = data.comment;

    saveBtn.textContent = "Save";
    saveBtn.classList.add("message__button", "button");
    saveBtn.addEventListener("click", onSave);

    messageElem.insertBefore(textArea, btnSection);
    btnSection.appendChild(saveBtn);

    function onSave(event) {
      const updatedData = { ...data };
      event.preventDefault();
      comment.textContent = textArea.value;
      updatedData.comment = comment.textContent;
      self.updateMessage(updatedData);
      cleanUp();
    }
    function cleanUp() {
      saveBtn.removeEventListener("click", onSave);
      btnSection.removeChild(saveBtn);
      messageElem.removeChild(textArea);
    }
  }
  deleteMessage({ messageElem, data }) {
    messageElem.parentElement.removeChild(messageElem);

    fetch(this.url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch(error => console.error(error));
  }
  renderMessages(messageData) {
    this.messageList.innerHTML = "";
    // TODO: create element with DOM API instead of innerHTML
    messageData.forEach(message => {
      const listItem = `
        <li class="message">
          <input type="hidden" value="${message.id}" data-id />
          <input type="hidden" value="${message.sender}" data-author />
          <input type="hidden" value="${message.text}" data-comment />
          <p class="message__author">Username: ${message.sender}</p>
          <p class="message__comment">Comment: <br /> ${message.text}</p>
          <div class="message__buttons">
            <button class="message__edit message__button button">Edit</button>
            <button class="message__delete message__button button">Delete</button>
          </div>
        </li>
      `;
      this.messageList.innerHTML += listItem;
    });
  }
  initialize() {
    this.submitBtn.addEventListener("click", event => {
      event.preventDefault();
      this.submitNewMessage.call(this);
    });
    this.messageList.addEventListener("click", event => {
      const target = event.target;
      if (target.classList.contains("message__edit")) {
        const message = getParentElementWithClass(event.target, "message");
        const originalMessageData = this.retrieveDataFromMessage(message);

        this.editMessage({ messageElem: message, data: originalMessageData });
      }
      if (target.classList.contains("message__delete")) {
        const message = getParentElementWithClass(event.target, "message");
        const originalMessageData = this.retrieveDataFromMessage(message);
        this.deleteMessage({ messageElem: message, data: originalMessageData });
      }
    });
    this.fetchAllMessages();
  }
}

const messageHandler = new MessageHandler();
messageHandler.initialize();
