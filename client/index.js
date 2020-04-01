class MessageHandler {
  messageTemplate = document.getElementById("template");
  messageList = document.querySelector(".messages");
  userName = document.getElementById("name");
  textarea = document.querySelector(".comment-field");
  submitBtn = document.querySelector(".submit");
  submitMode = "";

  handleSubmit() {
    const data = this.getFormData();

    // TODO: diffirentiate POST, PUT, DELETE
    fetch("http://localhost:3003/messages", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        console.log("RESPONSE FROM SERVER", response);
      })
      .catch(err => console.error(err));
  }
  getFormData() {
    const formData = {};
    formData.userName = this.userName.value;
    formData.comment = this.textarea.value;
    return formData;
  }
  postMessage(data) {}
  fetchAllMessages() {
    fetch("http://localhost:3003/messages").then(data => {
      const formatted = JSON.parse(data);
      this.renderMessages(formatted);
    });
  }
  renderMessages(messageData) {
    // console.dir(this.#messageTemplate)
  }
  initialize() {
    this.submitBtn.addEventListener("click", event => {
      event.preventDefault();
      this.handleSubmit.call(this);
    });
  }
}

const messageHandler = new MessageHandler();
messageHandler.initialize();
