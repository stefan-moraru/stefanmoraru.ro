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
    .end((err, response) => {
      if (err) {
        rej(err);
      } else {
        res(response);
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

document.getElementById('run').addEventListener('click', run);
document.getElementById('save').addEventListener('click', saveCode);

function saveCode() {
  const code = editorCode.getValue();

  var blob = new Blob([code], { type: 'text/plain;charset=utf-8' });

  saveAs(blob, window.prompt('Numele fisierului', '') + '.alk');
}

function loadExample (example) {
const examples = {
'bubblesort': {
  'code': 'hi',
  'params': 'bau'
},
'gcd': {
'code': `gcd(a, b)
{
  while (a != b) {
    if (a > b)  a = a - b;
    if (b > a) b = b - a;
  }

  return a;
}

x = gcd(a, b);`,
'params': `a |-> 200 b |-> 100`
},
'dfs': {
'code': `i = 0;
  
while (i < D.n) {
  
  p[i] = (D.a)[i];
  
  S[i] = 0;
  
  i = i + 1;
  
}

SB = < i0 >;

S[i0] = 1;

while (SB.size() > 0) {

  i = SB.topFront();

  if (p[i].size() == 0) {

    SB.popFront();

  }

  else {

    j = p[i].topFront();

    p[i].popFront();

    if (S[j] == 0) {

    S[j] = 1;

    SB.pushFront(j);

    }

  }
}

 }`,
'params': `D |-> { n -> 3 a -> [ < 1, 2 >, < 2, 0 >, < 0 > ] } i0 |-> 1`
}
};

  editorCode.setValue(examples[example].code, 1);
  editorParams.setValue(examples[example].params, 1);

}

