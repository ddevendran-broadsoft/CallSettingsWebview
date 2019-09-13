/* Copyright © 2017 BroadSoft Inc. */

import {Injectable, Inject} from '@angular/core';
import {Http, Response, Request, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()

/*This class handles the communication between the application and the server (XSI)*/
export class HttpServices {

  proxyUrl = 'http://127.0.0.1:8080/BWWebProxy/proxy';
  headers: Headers = new Headers();

  constructor(private http: Http) {}

  /*Sends HTTP GET request to server */
  httpGetRequest(serviceUrl) {

    this.setHeaders(serviceUrl);

    if (window['applicationMode'] === 'dev') {
      return this.http
        .get(this.proxyUrl, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);
    } else {
      return this.http
        .get(serviceUrl, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);
    }

  }

    /*Sends HTTP PUT request to server */
  httpPutRequest(serviceUrl, body) {

    this.setHeaders(serviceUrl);
    console.log('Body to be send: ', body);
    if (window['applicationMode'] === 'dev') {
      return this.http
        .put(this.proxyUrl, body, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);
    } else {
      return this.http
        .put(serviceUrl, body, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);

    }

  }

    /*Sends HTTP POST request to server */
  httpPostRequest(serviceUrl, body) {

    this.setHeaders(serviceUrl);
    console.log('Body to be send: ', body);
    if (window['applicationMode'] === 'dev') {
      return this.http
        .post(this.proxyUrl, body, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);
    } else {
      return this.http
        .post(serviceUrl, body, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);

    }
  }

  /*Sends HTTP DELETE request to server */
  httpDeleteRequest(serviceUrl, body) {
    this.setHeaders(serviceUrl);
    console.log('Body to be send: ', body);
    if (window['applicationMode'] === 'dev') {
      return this.http
        .delete(this.proxyUrl, new RequestOptions({
          body: body,
          headers: this.headers,
          withCredentials: true
        }))
        .catch(this.handleError);
    } else {
      return this.http
        .delete(serviceUrl, new RequestOptions({
          body: body,
          headers: this.headers,
          withCredentials: true
        }))
        .catch(this.handleError);
    }
  }

  private handleError(error: Response | any) {
    let errMsg: string;

    if (error instanceof Response) {
      errMsg = JSON.parse(JSON.stringify(error));
    }
    console.log('err code: ' + errMsg['status'] + ' err Text:' + errMsg['statusText']);
    if (error && error.status === 401) {
      window.location.href = window.location.href.replace(/[\?#].*|$/, '?authFailed=true'); // Reloads the application
    }
    return Observable.throw(error);

  }

    /*Sets the headers that has to be send with the HTTP request to the server*/
  private setHeaders(serviceUrl) {
    this.headers.set('Authorization', window['callSettingsHeroInput']['authorization']);
    if (window['callSettingsHeroInput']['loginToken']) {
      this.headers.set('Authorization', 'BroadWorksSSO '.concat(window['callSettingsHeroInput']['loginToken']));

    }
    this.headers.set('X-BroadWorks-No-AuthChallenge', 'true');
    this.headers.set('Content-type', 'application/xml;charset=UTF-8');
    if (window['applicationMode'] === 'dev') {
      this.headers.set('url', serviceUrl);
    }
  }

  /*This method is to be invoked only in the dev/QA mode*/
  loginTokenPostRequest(serviceUrl) {

    this.setLoginTokenRequestHeaders(serviceUrl, window['callSettingsHeroInput'].userId, window['devUserPwd']);
    const body = '';

    if (window['applicationMode'] === 'dev') {
      return this.http
        .post(this.proxyUrl, body, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);
    } else if (window['applicationMode'] === 'qa') {
      return this.http
        .post(serviceUrl, body, {headers: this.headers, withCredentials: true})
        .catch(this.handleError);
    }

  }

    /*This method is to be invoked only in the dev/QA mode*/
  setLoginTokenRequestHeaders(serviceUrl, userId, password) {
    this.headers.set('Authorization', 'Basic ' + (btoa(userId + ':' + password)));
    this.headers.set('Content-type', 'application/xml;charset=UTF-8');
    if (window['applicationMode'] === 'dev') {
      this.headers.set('url', serviceUrl);
    }
  }

}
