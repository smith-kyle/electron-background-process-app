const ipc = require('ipc');
const _ = require('lodash');
const uuid = require('uuid');
const backgroundFunctions = require('../background/backgroundFunctions');

const BackgroundRunner = {
  run(funcName, args) {
    const eventKey = uuid.v4();
    const payload = {
      funcName,
      args,
      eventKey
    };

    return new Promise((resolve, reject) => {
      function taskCompleteCallback(data) {
        const resultType = data.resultType;
        const result = data.result;
        const reason = data.reason;
        const replyEventKey = data.eventKey;

        if (replyEventKey === eventKey) {
          switch (resultType) {
          case 'BACKGROUND_RESOLVE':
            ipc.removeListener('BACKGROUND_REPLY', taskCompleteCallback);
            resolve(result);
            break;
          case 'BACKGROUND_REJECT':
            ipc.removeListener('BACKGROUND_REPLY', taskCompleteCallback);
            reject(reason);
            break;
          default:
          }
        }
      }
      ipc.on('BACKGROUND_REPLY', taskCompleteCallback);
      ipc.send('BACKGROUND_START', payload);
    });
  }
};

// Auto generate BackgroundHelper functions to match the functions within src/js/backgroundTasks
_.forEach(backgroundFunctions, (func, funcName) => {
  if (_.isFunction(func)) {
    BackgroundRunner[funcName] = function() {
      const args = _.map(arguments, (element) => element);
      return BackgroundRunner.run(
        funcName,
        args
      );
    };
  }
});

module.exports = BackgroundRunner;
