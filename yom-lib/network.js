import jsCookie from "js-cookie";
import { getAbsoultPath, key2UpperCase } from "./common/utils";
import { Event } from "./common/protocol";
import { addNetwork, getNetworks } from "./datacenter";
import uuid from "string-random";
import { isSelf } from "./common/utils.js";
import {
  FilterType,
  isUrlFiltered,
  isReqBodyFiltered,
  isResBodyFiltered,
} from "./filter";

const getTimestamp = () => Date.now() / 1000;

export default class Network {
  namespace = "Network";

  // the unique id of the request
  requestId = uuid(32);
  // TODO chenshenghua 临时屏蔽，后续涉及到实时获取时，还要用到
  // responseText = new Map();

  isEnable = false;

  socketSend = (data) => {
    if (this.isEnable) {
      this.send(data);
    }
    const url = data.params?.request?.url;
    if (isUrlFiltered(url)) return;
    addNetwork(data);
  };

  constructor() {
    this.hookXhr();
    if (isSelf()) this.hookShareWorkerFetch();
    else this.hookFetch();
  }

  /**
   * Format http response header
   * @static
   * @param {String} header http response header eg：content-type: application/json; charset=UTF-8\n date: Wed, 15 Sep 2021 07:20:26 GMT
   */
  static formatResponseHeader(header) {
    const headers = {};
    header
      .split("\n")
      .filter((val) => val)
      .forEach((item) => {
        const [key, val] = item.split(":");
        headers[key2UpperCase(key)] = val;
      });
    return headers;
  }

  /**
   * Get the default http request header, currently only ua, cookie
   * @static
   */
  static getDefaultHeaders() {
    const headers = {
      "User-Agent": navigator.userAgent,
    };
    if (isSelf()) return headers;
    if (document.cookie) {
      headers.Cookie = document.cookie;
    }

    return headers;
  }

  /**
   * @public
   */
  enable() {
    this.isEnable = true;
  }

  /**
   * Get request response content
   * @public
   * @param {Object} param
   * @param {Number} param.requestId
   */
  getResponseBody({ requestId }) {
    return {
      body: "{}",
      base64Encoded: false,
    };
    // return {
    //   body: this.responseText.get(requestId),
    //   base64Encoded: false,
    // };
  }

  /**
   * @public
   */
  getCookies() {
    const cookies = jsCookie.get();
    return {
      cookies: Object.keys(cookies).map((name) => ({
        name,
        value: cookies[name],
      })),
    };
  }

  /**
   * @public
   * @param {Object} param
   * @param {String} param.name cookie name
   */
  deleteCookies({ name }) {
    jsCookie.remove(name, { path: "/" });
  }

  /**
   * @public
   * @param {Object} param
   * @param {String} param.name cookie name
   * @param {String} param.value cookie value
   * @param {String} param.path path
   */
  setCookie({ name, value, path }) {
    jsCookie.set(name, value, { path });
  }

  /**
   * Get the unique id of the request
   * @private
   */
  getRequestId() {
    this.requestId = uuid(32);
    return this.requestId;
  }

  /**
   * Intercept XMLHttpRequest request
   * @private
   */
  hookXhr() {
    const instance = this;
    const xhrSend = XMLHttpRequest.prototype.send;
    const xhrOpen = XMLHttpRequest.prototype.open;
    const xhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      const _url = getAbsoultPath(url);
      this.$$request = {
        method,
        url: _url,
        requestId: instance.getRequestId(),
        headers: Network.getDefaultHeaders(),
      };
      xhrOpen.call(this, method, _url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (data) {
      xhrSend.call(this, data);

      const request = this.$$request;
      const { requestId, url, method } = request;
      if (method.toLowerCase() === "post" && !isReqBodyFiltered(url)) {
        request.postData = data;
        request.hasPostData = !!data;
      }
      instance.socketSend({
        method: Event.requestWillBeSent,
        params: {
          requestId,
          request,
          documentURL: location.href,
          timestamp: getTimestamp(),
          wallTime: Date.now(),
          type: this.$$requestType || "XHR",
        },
      });

      this.addEventListener("readystatechange", () => {
        // After the request is completed, get the http response header
        if (this.readyState === 4) {
          const headers = this.getAllResponseHeaders();
          const responseHeaders = Network.formatResponseHeader(headers);
          instance.sendNetworkEvent({
            requestId,
            url: getAbsoultPath(url),
            headers: responseHeaders,
            blockedCookies: [],
            headersText: headers,
            type: this.$$requestType || "XHR",
            status: this.status,
            statusText: this.statusText,
            encodedDataLength: Number(this.getResponseHeader("Content-Length")),
          });
        }
      });

      this.addEventListener("load", () => {
        if (this.responseType === "" || this.responseType === "text") {
          // Cache the response result after the request ends, which will be used when getResponseBody
          // instance.responseText.set(this.$$request.requestId, this.responseText);
          if (isResBodyFiltered(url)) return;
          addNetwork({
            method: Event.responseBody,
            params: {
              requestId,
              body: this.responseText,
            },
          });
        }
      });
    };

    XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
      if (this.$$request) {
        this.$$request.headers[key] = value;
      }
      xhrSetRequestHeader.call(this, key, value);
    };
  }

  /**
   * Intercept Fetch requests
   * @private
   */
  hookFetch() {
    const instance = this;
    const originFetch = window.fetch;

    window.fetch = function (request, initConfig = {}) {
      let url;
      let method;
      let data = "";
      // When request is a string, it is the requested url
      if (typeof request === "string") {
        url = request;
        method = initConfig.method || "get";
        data = initConfig.body;
      } else {
        // Otherwise it is a Request object
        ({ url, method } = request);
      }

      url = getAbsoultPath(url);
      const requestId = instance.getRequestId();
      const sendRequest = {
        url,
        method,
        requestId,
        headers: Network.getDefaultHeaders(),
      };

      if (method.toLowerCase() === "post" && !isReqBodyFiltered(url)) {
        sendRequest.postData = data;
        sendRequest.hasPostData = !!data;
      }

      instance.socketSend({
        method: Event.requestWillBeSent,
        params: {
          requestId,
          documentURL: location.href,
          timestamp: getTimestamp(),
          wallTime: Date.now(),
          type: "Fetch",
          request: sendRequest,
        },
      });

      let oriResponse;
      return originFetch(request, initConfig)
        .then((response) => {
          // Temporarily save the raw response to the request
          oriResponse = response;

          const { headers, status, statusText } = response;
          const responseHeaders = {};
          let headersText = "";
          headers.forEach((val, key) => {
            key = key2UpperCase(key);
            responseHeaders[key] = val;
            headersText += `${key}: ${val}\r\n`;
          });

          instance.sendNetworkEvent({
            url,
            requestId,
            status,
            statusText,
            headersText,
            type: "Fetch",
            blockedCookies: [],
            headers: responseHeaders,
            encodedDataLength: Number(headers.get("Content-Length")),
          });

          const contentType = headers.get("Content-Type");
          if (
            [
              "application/json",
              "application/javascript",
              "text/plain",
              "text/html",
              "text/css",
            ].some((type) => contentType?.includes(type))
          ) {
            return response.clone().text();
          }
          return "";
        })
        .then((responseBody) => {
          // instance.responseText.set(requestId, responseBody);
          if (isResBodyFiltered(url)) return;
          addNetwork({
            method: Event.responseBody,
            params: {
              requestId,
              body: responseBody,
            },
          });
          // Returns the raw response to the request
          return oriResponse;
        })
        .catch((error) => {
          instance.sendNetworkEvent({
            url,
            requestId,
            blockedCookies: [],
            type: "Fetch",
          });
          throw error;
        });
    };
  }
  hookShareWorkerFetch() {
    const instance = this;
    const originFetch = self.fetch;

    self.fetch = function (request, initConfig = {}) {
      let url;
      let method;
      let data = "";
      // When request is a string, it is the requested url
      if (typeof request === "string") {
        url = request;
        method = initConfig.method || "get";
        data = initConfig.body;
      } else {
        // Otherwise it is a Request object
        ({ url, method } = request);
      }

      url = getAbsoultPath(url);
      const requestId = instance.getRequestId();
      const sendRequest = {
        url,
        method,
        requestId,
        headers: Network.getDefaultHeaders(),
      };

      if (method.toLowerCase() === "post" && !isReqBodyFiltered(url)) {
        sendRequest.postData = data;
        sendRequest.hasPostData = !!data;
      }

      instance.socketSend({
        method: Event.requestWillBeSent,
        params: {
          requestId,
          documentURL: location.href,
          timestamp: getTimestamp(),
          wallTime: Date.now(),
          type: "Fetch",
          request: sendRequest,
        },
      });

      let oriResponse;
      return originFetch(request, initConfig)
        .then((response) => {
          // Temporarily save the raw response to the request
          oriResponse = response;

          const { headers, status, statusText } = response;
          const responseHeaders = {};
          let headersText = "";
          headers.forEach((val, key) => {
            key = key2UpperCase(key);
            responseHeaders[key] = val;
            headersText += `${key}: ${val}\r\n`;
          });

          instance.sendNetworkEvent({
            url,
            requestId,
            status,
            statusText,
            headersText,
            type: "Fetch",
            blockedCookies: [],
            headers: responseHeaders,
            encodedDataLength: Number(headers.get("Content-Length")),
          });

          const contentType = headers.get("Content-Type");
          if (
            [
              "application/json",
              "application/javascript",
              "text/plain",
              "text/html",
              "text/css",
            ].some((type) => contentType?.includes(type))
          ) {
            return response.clone().text();
          }
          return "";
        })
        .then((responseBody) => {
          // instance.responseText.set(requestId, responseBody);
          if (isResBodyFiltered(url)) return;
          addNetwork({
            method: Event.responseBody,
            params: {
              requestId,
              body: responseBody,
            },
          });
          // Returns the raw response to the request
          return oriResponse;
        })
        .catch((error) => {
          instance.sendNetworkEvent({
            url,
            requestId,
            blockedCookies: [],
            type: "Fetch",
          });
          throw error;
        });
    };
  }

  /**
   * @private
   */
  sendNetworkEvent(params) {
    const {
      requestId,
      headers,
      headersText,
      type,
      url,
      status,
      statusText,
      encodedDataLength,
    } = params;

    if (isUrlFiltered(url)) return;

    this.socketSend({
      method: Event.responseReceivedExtraInfo,
      params: { requestId, headers, blockedCookies: [], headersText },
    });

    this.socketSend({
      method: Event.responseReceived,
      params: {
        type,
        requestId,
        timestamp: getTimestamp(),
        response: { url, status, statusText, headers },
      },
    });

    this.socketSend({
      method: Event.loadingFinished,
      params: {
        requestId,
        encodedDataLength,
        timestamp: getTimestamp(),
      },
    });
  }

  /**
   * get the networks from db
   * @public
   */
  async getDbNetworks(params) {
    console.log("getDbNetworks", params);
    const res = await getNetworks(params.startTime, params.endTime);
    console.log("getDbNetworks", params, res);
    res?.forEach((item) => this.send(item.data));
  }
}
