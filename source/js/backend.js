'use strict';

(function () {
  var SEND_FORM_URL = 'https://echo.htmlacademy.ru';
  var HTTP_STATUS_CODE_200 = 200;
  var TIMEOUT = 10000;
  var RESPONSE_STATUS = 'Ошибка: ';
  var ERROR_MESSAGE = 'Произошла ошибка соединения';
  var ERROR_TIMEOUT = {
    message: 'Запрос не успел выполниться за ',
    units: 'мс'
  };

  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_CODE_200) {
        onLoad(xhr.response);
      } else {
        onError(RESPONSE_STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('POST', SEND_FORM_URL);
    xhr.send(data);
  };

  window.server = {
    upload: upload
  };
})();


(function () {
  var form = document.querySelector('.form');
  var input = document.getElementById('address');

  var submitHandler = function (evt) {
    window.server.upload(new FormData(form), onLoad, onError);
    evt.preventDefault();
  };

  var onLoad = function () {
    resetForm();
    // createPopup();
  };

  var onError = function () {
    createErrorPopup(ErrorsList.loadingError, errorPopupClickHandler, errorPopupCloseKey);

    document.removeEventListener('keydown', escClickHandler);
    form.removeEventListener('focusout', blurHandler);
  };

  var resetForm = function () {
    form.reset();
    input.setAttribute('value', '');
    window.script.clearMarker(null);
    window.script.map.panTo({lat: 59.939722, lng: 30.332004});
    window.script.map.setZoom(13);
  };

  form.addEventListener('submit', submitHandler);
}) ();
