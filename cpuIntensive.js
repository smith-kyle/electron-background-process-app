const cpuIntensive = {
  doStuff() {
    var value = 0;
    for (var i = 0; i < 100000000; i++) {
      value += Math.random();
    }
    return Math.floor(value / Math.random());
  }
};

module.exports = cpuIntensive;
