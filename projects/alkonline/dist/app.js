'use strict';

var API_URL = 'https://alkonline.herokuapp.com/api/v1/alk/run';

var configureEditor = function configureEditor(editor) {
  var readonly = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  editor.setTheme('ace/theme/tomorrow_night');
  editor.getSession().setMode('ace/mode/javascript');
  editor.renderer.setShowGutter(false);
  editor.renderer.setScrollMargin(40);
  editor.renderer.setPadding(20);
  editor.setShowPrintMargin(false);
  editor.setHighlightActiveLine(false);

  if (readonly) {
    editor.setReadOnly(true);
    editor.renderer.$cursorLayer.element.style.opacity = 0;
  }

  return editor;
};

var editorCode = configureEditor(ace.edit('code'));
var editorParams = configureEditor(ace.edit('params'));
var editorResult = configureEditor(ace.edit('result'));

var getData = function getData(url, body) {
  return new Promise(function (res, rej) {
    superagent.post(url).send(body).end(function (err, res) {
      if (err) {
        rej(err);
      } else {
        res(res);
      }
    });
  });
};

var emptyResult = function emptyResult(result) {
  editorResult.setValue('', 1);
};

var saveResult = function saveResult(result) {
  editorResult.setValue(result.text, 1);
};

var getLoading = function getLoading() {
  return document.getElementsByClassName('loading')[0];
};

var getNotloading = function getNotloading() {
  return document.getElementsByClassName('notloading')[0];
};

var hideLoader = function hideLoader() {
  getLoading().hidden = true;
  getNotloading().hidden = false;
};

var showLoader = function showLoader() {
  getLoading().hidden = false;
  getNotloading().hidden = true;
};

var run = function run() {

  var code = editorCode.getValue();
  var params = editorParams.getValue();

  if (code.length < 10) {
    return;
  }

  showLoader();
  emptyResult();

  return getData(API_URL, { code: code, params: params || '.Map' }).then(saveResult).then(hideLoader);
};

document.getElementById('run').addEventListener('click', run);