const cpuIntensive = {
  doStuff() {
    var value = 0;
    for (var i = 0; i < 100000000; i++) {
      value += Math.random();
    }
    return Math.floor(value / Math.random());
  },

  doCallbackStuff(cb) {
    var newPercent = 0;
    for (var i = 0; i < 100000000; i++) {
      if (newPercent === Math.floor(i / 100000000 * 100)) {
        cb(Math.floor(newPercent++));
      }
    }
  }
};

module.exports = cpuIntensive;
