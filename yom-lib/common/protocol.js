
export const Event = {
  styleSheetAdded: 'CSS.styleSheetAdded',

  scriptParsed: 'Debugger.scriptParsed',

  domStorageItemRemoved: 'DOMStorage.domStorageItemRemoved',
  domStorageItemsCleared: 'DOMStorage.domStorageItemsCleared',

  setChildNodes: 'DOM.setChildNodes',
  childNodeCountUpdated: 'DOM.childNodeCountUpdated',
  childNodeInserted: 'DOM.childNodeInserted',
  childNodeRemoved: 'DOM.childNodeRemoved',
  attributeModified: 'DOM.attributeModified',
  attributeRemoved: 'DOM.attributeRemoved',
  characterDataModified: 'DOM.characterDataModified',

  requestWillBeSent: 'Network.requestWillBeSent',
  responseReceivedExtraInfo: 'Network.responseReceivedExtraInfo',
  responseReceived: 'Network.responseReceived',
  loadingFinished: 'Network.loadingFinished',
  responseBody: 'Network.responseBody',

  screencastFrame: 'Page.screencastFrame',

  executionContextCreated: 'Runtime.executionContextCreated',
  consoleAPICalled: 'Runtime.consoleAPICalled',
  exceptionThrown: 'Runtime.exceptionThrown',

  nodeHighlightRequested: 'Overlay.nodeHighlightRequested',
  inspectNodeRequested: 'Overlay.inspectNodeRequested',

  captured: 'ScreenPreview.captured',
  syncScroll: 'ScreenPreview.syncScroll',
  webrtcAnswer: 'ScreenRecorder.webrtcAnswer',
};
