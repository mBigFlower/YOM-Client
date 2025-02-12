import { objectFormat, objectRelease, getObjectProperties } from './common/remoteObject';
import { Event } from './common/protocol';
import { addConsole, getConsole } from './datacenter';
import { callsites } from './common/utils'
import { configParams } from './config'
import { isSelf } from './common/utils'

export default class Console {
  namespace = 'Console';

  cacheConsole = [];

  cacheError = [];

  isEnable = false;

  socketSend = async (type, data) => {
    // TODO chenshenghua 临时屏蔽，后续涉及到实时获取时，还要用到
    return;
    if (type === 'console') {
      this.cacheConsole.push(data);
    } else if (type === 'error') {
      this.cacheError.push(data);
    }
    if (this.isEnable) {
      this.send(data);
    }
  };

  constructor() {
    if (configParams.yomConsoleEnable !== "1") return;
    this.listenError();

    if (isSelf()) this.hookShareWorkerConsole();
    else this.hookConsole();
  }

  /**
   * Get call stack
   * @static
   * @param {Error} error
   */
  static getCallFrames(error) {
    let callFrames = [];
    let stack;
    if (error?.stack) {
      stack = error.stack;
      callFrames = stack.split('\n').map(val => ({
        functionName: val,
        ...Console.getPositionAndUrl(val)
      }));
      // Safari does not support captureStackTrace
    } else if (Error.captureStackTrace) {
      callFrames = callsites().map(val => ({
        functionName: val.getFunctionName(),
        lineNumber: val.getLineNumber(),
        columnNumber: val.getColumnNumber(),
        url: val.getFileName(),
      }));
    } else {
      stack = new Error().stack;
      console.info(777)
      console.info(stack)
      callFrames = stack.split('\n').map(val => ({
        functionName: val,
        ...Console.getPositionAndUrl(val)
      }));
    }

    callFrames.shift();
    return callFrames;
  }

  /**
   * Get the line number and column number of each stack code from the error stack
   * @static
   */
  static getPositionAndUrl(str) {
    const reg = /at\s+(.*)(?::([0-9]+):([0-9]+))$/; // for android
    const reg1 = /@+(.*)(?::([0-9]+):([0-9]+))$/; // for ios

    let res;
    if (reg.test(str)) {
      res = reg.exec(str);
    } else if (reg1.test(str)) {
      res = reg1.exec(str);
    }

    if (res) {
      return {
        url: res[1],
        lineNumber: res[2],
        columnNumber: res[3]
      };
    }

    return {};
  }

  /**
   * @public
   */
  enable() {
    this.isEnable = true;
    this.cacheConsole.forEach(data => this.send(data));
    this.cacheError.forEach(data => this.send(data));

    this.send({
      method: Event.executionContextCreated,
      params: {
        context: {
          id: 1,
          name: 'top',
          origin: location.origin,
        }
      }
    });
  }

  /**
   * script execution
   * @public
   * @param {Object} param
   * @param {String} param.expression expression string
   * @param {Boolean} param.generatePreview whether to generate a preview
   */
  evaluate({ expression, generatePreview }) {
    // eslint-disable-next-line
    const res = eval(expression);
    return {
      result: objectFormat(res, { preview: generatePreview }),
    };
  }

  /**
   * Get object properties
   * @public
   */
  getProperties(params) {
    return {
      result: getObjectProperties(params),
    };
  }

  /**
   * release object
   * @public
   */
  releaseObject(params) {
    objectRelease(params);
  }

  /**
   * Intercept method of console object
   * @private
   */
  hookConsole() {
    const methods = {
      log: 'log',
      warn: 'warning',
      info: 'info',
      error: 'error',
      debug: 'debug',
    };

    Object.keys(methods).forEach((key) => {
      const nativeConsoleFunc = window.console[key];
      window.console[key] = (...args) => {
        if (configParams.chromeConsoleEnable === '1') nativeConsoleFunc(...args);
        addConsole(methods[key], Date.now(), args);
      };
    });
  }

  hookShareWorkerConsole() {
    const methods = {
      log: 'log',
      warn: 'warning',
      info: 'info',
      error: 'error',
      debug: 'debug',
    };
    Object.keys(methods).forEach((key) => {
      const nativeConsoleFunc = self.console[key];
      self.console[key] = (...args) => {
        if (configParams.chromeConsoleEnable === '1') nativeConsoleFunc(...args);
        addConsole(methods[key], Date.now(), args);
      };
    })
  }
  /**
   * Global error monitor
   * @private
   */
  listenError() {
    const exceptionThrown = (error) => {
      const data = {
        method: Event.exceptionThrown,
        params: {
          timestamp: Date.now(),
          exceptionDetails: {
            text: 'Uncaught',
            exception: {
              type: 'object',
              subtype: 'error',
              className: error?.name || 'Error',
              description: error?.stack || 'Script error.',
            },
            stackTrace: {
              callFrames: Console.getCallFrames(error)
            },
          }
        }
      };
      this.socketSend('error', data);
    };
    if (isSelf()) {
      self.addEventListener('error', e => exceptionThrown(e.error));
      self.addEventListener('unhandledrejection', e => exceptionThrown(e.reason));
    } else {
      window.addEventListener('error', e => exceptionThrown(e.error));
      window.addEventListener('unhandledrejection', e => exceptionThrown(e.reason));
    }
  }

  /**
   * get the consoles from db
   * @public
   */
  async getDbConsoles(params) {
    const res = await getConsole(params.startTime, params.endTime);
    console.log('getDbConsoles', res);
    res?.forEach(item => this.send(item.data));
  }
};
