'use strict';

(function () {
  var SEND_FORM_URL = 'https://echo.htmlacademy.ru';
  var HTTP_STATUS_CODE_200 = 200;
  var RESPONSE_STATUS = 'Ошибка: ';

  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_CODE_200) {
        onLoad(xhr.response);
      } else {
        onError(RESPONSE_STATUS + xhr.status + ' ' + xhr.statusText);
        console.log('error');
      }
    });

    xhr.open('POST', SEND_FORM_URL);
    xhr.send(data);
  };

  window.server = {
    upload: upload
  };
})();
