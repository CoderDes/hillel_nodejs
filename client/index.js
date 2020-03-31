class MessageHandler {
  #messageTemplate = document.getElementById("template");
  #messageList = document.querySelector(".messages");

  postMessage(data) {}
  fetchAllMessages() {
    fetch("http://localhost:3000/").then(data => {
      const formatted = JSON.parse(data); //expected to be an object
      this.renderMessages(formatted);
    });
  }
  renderMessages(messageData) {
    // console.dir(this.#messageTemplate)
  }
  initialize() {
    this.fetchAllMessages();
  }
}

document.addEventListener("load", () => {
  const messageHandler = new MessageHandler();
  messageHandler.initialize();
});
