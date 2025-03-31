var stopwatches = [];
ipc.send("GetStopwatches");

$("#addbutton").on("click", function() {
  $("#stopwatches").append(`
    <div class="stopwatch">
      <div class="time monofont">00:00:00.00</div>
      <div class="units monofont"><span>hours</span><span>minutes</span><span>seconds</span></div>
      <br><br>
      <button class="mainbutton">Start</button>
      <button class="restartbutton">Restart</button>
      <button class="deletebutton">Delete</button>
    </div>
  `);
  const latestStopwatch = $("#stopwatches .stopwatch").last();
  stopwatches.push({
    startTime: null,
    elapsedTime: 0,
    interval: null,
    running: false,
    elements: {
      time: latestStopwatch.find(".time"),
      units: latestStopwatch.find(".units"),
      mainbutton: latestStopwatch.find(".mainbutton"),
      restartbutton: latestStopwatch.find(".restartbutton"),
      deletebutton: latestStopwatch.find(".deletebutton")
    },
    toggle: function() {
      const self = this;
      if (!self.running) {
        self.elements.mainbutton.html("Stop");
        self.startTime = Date.now() - self.elapsedTime;
        self.running = true;
        self.interval = setInterval(function() {
          self.elapsedTime = Date.now() - self.startTime;

          let milliseconds = Math.floor((self.elapsedTime % 1000) / 10);
          let seconds = Math.floor((self.elapsedTime / 1000) % 60);
          let minutes = Math.floor((self.elapsedTime / (1000 * 60)) % 60);
          let hours = Math.floor((self.elapsedTime / (1000 * 60 * 60)) % 100);

          milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;
          seconds = seconds < 10 ? "0" + seconds : seconds;
          minutes = minutes < 10 ? "0" + minutes : minutes;
          hours = hours < 10 ? "0" + hours : hours;

          self.elements.time.html(`${hours}:${minutes}:${seconds}.${milliseconds}`);
        }, 10);
      }
      else {
        clearInterval(self.interval);
        self.running = false;
        self.elements.mainbutton.html("Start");
      }
    }
  });

});

$(document).on("click", ".stopwatch .mainbutton", function() {
  let index = $(".stopwatch .mainbutton").index(this);
  stopwatches[index].toggle();
});

$(document).on("click", ".stopwatch .restartbutton", function() {
  let index = $(".stopwatch .restartbutton").index(this);
  clearInterval(stopwatches[index].interval);
  stopwatches[index].elapsedTime = 0;
  stopwatches[index].startTime = null;
  stopwatches[index].running = false;
  stopwatches[index].elements.time.html("00:00:00.00");
});

$(document).on("click", ".stopwatch .deletebutton", function() {
  let index = $(".stopwatch .deletebutton").index(this);
  clearInterval(stopwatches[index].interval);
  stopwatches.splice(index, 1);
  $(".stopwatch").eq(index).remove();
});

window.addEventListener("beforeunload", (event) => {
  let cleanedStopwatches = [...stopwatches];
  for (let i = 0; i < cleanedStopwatches.length; i++) {
    if (cleanedStopwatches[i].running) {
      cleanedStopwatches[i].toggle();
    }
    delete cleanedStopwatches[i].elements;
    delete cleanedStopwatches[i].toggle;
  }

  ipc.send("SaveStopwatches", cleanedStopwatches);
});


ipc.on("LoadStopwatches", (event, loadedStopwatches) => {
  for (let i = 0; i < loadedStopwatches.length; i++) {

    $("#stopwatches").append(`
      <div class="stopwatch">
        <div class="time monofont">00:00:00.00</div>
        <div class="units monofont"><span>hours</span><span>minutes</span><span>seconds</span></div>
        <br><br>
        <button class="mainbutton">Start</button>
        <button class="restartbutton">Restart</button>
        <button class="deletebutton">Delete</button>
      </div>
    `);
    const latestStopwatch = $("#stopwatches .stopwatch").last();
    stopwatches.push({
      startTime: loadedStopwatches[i].startTime,
      elapsedTime: loadedStopwatches[i].elapsedTime,
      interval: loadedStopwatches[i].interval,
      running: loadedStopwatches[i].running,
      elements: {
        time: latestStopwatch.find(".time"),
        units: latestStopwatch.find(".units"),
        mainbutton: latestStopwatch.find(".mainbutton"),
        restartbutton: latestStopwatch.find(".restartbutton"),
        deletebutton: latestStopwatch.find(".deletebutton")
      },
      toggle: function() {
        const self = this;
        if (!self.running) {
          self.elements.mainbutton.html("Stop");
          self.startTime = Date.now() - self.elapsedTime;
          self.running = true;
          self.interval = setInterval(function() {
            self.elapsedTime = Date.now() - self.startTime;

            let milliseconds = Math.floor((self.elapsedTime % 1000) / 10);
            let seconds = Math.floor((self.elapsedTime / 1000) % 60);
            let minutes = Math.floor((self.elapsedTime / (1000 * 60)) % 60);
            let hours = Math.floor((self.elapsedTime / (1000 * 60 * 60)) % 100);

            milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            hours = hours < 10 ? "0" + hours : hours;

            self.elements.time.html(`${hours}:${minutes}:${seconds}.${milliseconds}`);
          }, 10);
        }
        else {
          clearInterval(self.interval);
          self.running = false;
          self.elements.mainbutton.html("Start");
        }
      }
    });
    let index = stopwatches.length - 1;

    let milliseconds = Math.floor((stopwatches[index].elapsedTime % 1000) / 10);
    let seconds = Math.floor((stopwatches[index].elapsedTime / 1000) % 60);
    let minutes = Math.floor((stopwatches[index].elapsedTime / (1000 * 60)) % 60);
    let hours = Math.floor((stopwatches[index].elapsedTime / (1000 * 60 * 60)) % 100);

    milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    hours = hours < 10 ? "0" + hours : hours;

    stopwatches[index].elements.time.html(`${hours}:${minutes}:${seconds}.${milliseconds}`);
  }
});
