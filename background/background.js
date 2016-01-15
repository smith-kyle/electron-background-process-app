const ipc = require('ipc');
const backgroundFunctions = require('./backgroundFunctions');

module.exports = function() {
  ipc.on('BACKGROUND_START', (payload) => {
    const funcName = payload.funcName;
    const args = payload.args;
    const eventKey = payload.eventKey;

    const backgroundPromise = new Promise((resolve, reject) => {
      try {
        const result = backgroundFunctions[funcName](...args);
        resolve(result);
      } catch(e) {
        reject(e);
      }
    });

    Promise.resolve(backgroundPromise)
      .then((result) => {
        ipc.send(
          'BACKGROUND_REPLY',
          {
            result,
            eventKey,
            resultType: 'BACKGROUND_RESOLVE'
          }
        );
      })
      .catch((reason) => {
        ipc.send(
          'BACKGROUND_REPLY',
          {
            reason,
            eventKey,
            resultType: 'BACKGROUND_REJECT'
          }
        );
      });
  });
};
