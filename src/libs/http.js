'use strict';
import Q from 'q';

export default class Http {

  constructor(name) {
    this.name = name;
  }

  get(url, data) {
    return this.requestGet('GET', url, data)
  }

  post(url, data) {
    return this.requestHttp('POST', url, data)
  }

  put(url, data) {
    return this.requestHttp('PUT', url, data)
  }

  deleteReq(url, data) {
    return this.requestHttp('DELETE', url, data)
  }

  requestGet(type, url, data) {
    let request = new XMLHttpRequest();
    let deferred = Q.defer();

    request.open(type, url, true);
    request.setRequestHeader("Authorization", "Bearer " + data);
    request.onload = onload;
    request.onerror = onerror;
    request.send();

    function onload() {
      if (request.status === 200) {
        try {
          if (request.responseText == 'OK') {
            deferred.resolve();
          } else {
            let data = JSON.parse(request.responseText);
            deferred.resolve(data);
          }
        } catch (e) {
          deferred.reject(e);
        }
      } else if (request.status === 400) {
        let object = JSON.parse(request.status);
        localStorage.setItem('role', object.role);
        let body = document.getElementById('root');
        body.className = body.className.replace(" modalBlock", "");
        return window.location.href = "/profile/products"
      } else if (request.status == 401) {
        window.location.href = "/";
      } else {
        window.location.href = "/";
        deferred.reject(new Error("Status code was " + request.status));
      }
    }

    function onerror() {
      deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
    }

    return deferred.promise;
  }


  requestHttp(type, url, data) {
    let request = new XMLHttpRequest();
    let deferred = Q.defer();

    request.open(type, url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = onload;
    request.onerror = onerror;
    request.send(data);

    function onload() {
      if (request.status === 200) {
        try {
          if (request.responseText == 'OK') {
            deferred.resolve();
          } else {
            let data = JSON.parse(request.responseText);
            deferred.resolve(data);
          }
        } catch (e) {
          deferred.reject(e);
        }
      } else if (request.status === 401) {
        window.location.href = "/";
      } else if (request.status === 400) {
        let body = document.getElementById('root');
        body.className = body.className.replace(" modalBlock", "");
        alert(request.responseText);
      } else {
        alert(request.responseText);
        deferred.reject(new Error("Status code was " + request.status));
      }
    }

    function onerror() {
      deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
    }

    return deferred.promise;
  }

}

