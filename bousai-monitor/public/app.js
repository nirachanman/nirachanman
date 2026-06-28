const socket = io();

function addMessage(
  type,
  msg
){

  const div =
    document.createElement(
      "div"
    );

  div.innerHTML =
    `<b>${type}</b> :
     ${msg.title}`;

  document
    .getElementById(
      "events"
    )
    .prepend(div);
}

socket.on(
  "eew",
  msg => {

    addMessage(
      "EEW",
      msg
    );

  }
);

socket.on(
  "tsunami",
  msg => {

    addMessage(
      "津波",
      msg
    );

  }
);

socket.on(
  "warning",
  msg => {

    addMessage(
      "警報",
      msg
    );

  }
);