const API_URL = 'https://alkonline.herokuapp.com/api/v1/alk/run';

const configureEditor = (editor, readonly = false) => {
    editor.setTheme('ace/theme/tomorrow_night');
    editor.getSession().setMode('ace/mode/javascript');
    editor.renderer.setScrollMargin(10);
    editor.renderer.setPadding(15);
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(false);
    editor.session.setUseWorker(false); //Disable warnings

    if (readonly) {
      editor.setReadOnly(true);
      editor.renderer.setShowGutter(false);
      editor.renderer.$cursorLayer.element.style.opacity=0
    }

    return editor;
};

const editorCode = configureEditor(ace.edit('code'));
const editorParams = configureEditor(ace.edit('params'))
const editorResult = configureEditor(ace.edit('result'), true);

const getData = (url, body) => {
  return new Promise((res, rej) => {
    superagent
    .post(url)
    .send(body)
    .end((err, res) => {
      if (err) {
        rej(err);
      } else {
        res(res);
      }
    });
  });
};

const emptyResult = (result) => {
  editorResult.setValue('', 1);
};

const saveResult = (result) => {
  editorResult.setValue(result.text, 1);
};

const getLoading = () => {
  return document.getElementsByClassName('loading')[0];
};

const getNotloading = () => {
  return document.getElementsByClassName('notloading')[0];
};

const hideLoader = () => {
  getLoading().hidden = true;
  getNotloading().hidden = false;
};

const showLoader = () => {
  getLoading().hidden = false;
  getNotloading().hidden = true;
};

const run = () => {

  const code = editorCode.getValue();
  const params = editorParams.getValue();

  if (code.length < 10) {
    return;
  }

  showLoader();
  emptyResult();

  return getData(API_URL, { code: code, params: params || '.Map' })
  .then(saveResult)
  .then(hideLoader);

};

function loadExample (example) {
  const examples = {
    'bubblesort': {
      'code': 'hi',
      'params': 'bau'
    }
  };

  console.log(examples[example]);

  editorCode.setValue(examples[example].code, 1);

}

document.getElementById('run').addEventListener('click', run);
