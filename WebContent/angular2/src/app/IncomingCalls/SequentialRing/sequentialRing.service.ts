/* Copyright © 2017 BroadSoft Inc. */

import {Injectable, Inject, Component} from '@angular/core';
import {Http, Response, Request, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {HttpServices} from 'app/AppCommon/httpservices.service';
import {IncomingComponent} from 'app/IncomingCalls/incoming.component'
import {SequentialRingServiceInput} from 'app/IncomingCalls/SequentialRing/sequentialRingServiceInput.service';
import {CriteriaArray} from 'app/IncomingCalls/SequentialRing/sequentialRingServiceInput.service';


@Injectable()
export class SequentialRingService {
  private res: Response;
  private headers: Headers = new Headers();
  private sequentialRingParsedJson;
  private criteriaArray: CriteriaArray[] = new Array();
  private isModified = false;
  private deletePosition = 100;   // Initially pointing to no array elements...
  constructor(private httpservices: HttpServices, private http: Http, private sequentialRingServiceInput: SequentialRingServiceInput) {

  }

  // Method to Get the values from the XSI and set the POJO with the values...
  getSequentialRingService(SequentialRingUrl, postSequentialRingGet) {

    this.httpservices.httpGetRequest(SequentialRingUrl)
      .subscribe((res) => {
        console.log('Sequential Ring Response Data Received: ', res.json());
        this.sequentialRingParsedJson = res.json();
        this.sequentialRingServiceInput.setIsRingBaseLocationFirst(this.sequentialRingParsedJson
        ['SequentialRing']['ringBaseLocationFirst']['$'] === 'true');
        this.sequentialRingServiceInput.setBaseLocationNumberOfRings(this.sequentialRingParsedJson
        ['SequentialRing']['baseLocationNumberOfRings']['$']);
        this.sequentialRingServiceInput.setIsContinueIfBaseLocationIsBusy(this.sequentialRingParsedJson
        ['SequentialRing']['continueIfBaseLocationIsBusy']['$'] === 'true');
        this.sequentialRingServiceInput.setIsCallerMayStopSearch(this.sequentialRingParsedJson
        ['SequentialRing']['callerMayStopSearch']['$'] === 'true');
        this.sequentialRingServiceInput.setSeqRingArrayInit(this.sequentialRingParsedJson);
        this.sequentialRingServiceInput.setCriteriaArrayInit(this.sequentialRingParsedJson);
        this.sequentialRingServiceInput.setIsSequentialRingActive(this.fetchIsSequentialRingActive());
        postSequentialRingGet(this.sequentialRingParsedJson);
      }, (err) => {
        console.log('Error getting the values in Sequential Ring.');
        postSequentialRingGet(null);
      });
  }

  // Computing ON/OFF display condition for Sequential Ring...
  fetchIsSequentialRingActive() {
    let flag = false;
    this.criteriaArray = this.sequentialRingServiceInput.getCriteriaArray();
    for (let index = 0; index < this.criteriaArray.length; index++) {
      if (this.criteriaArray[index].getIsActive()) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  fetchIsRingBaseLocationFirst() {
    return this.sequentialRingServiceInput.getIsRingBaseLocationFirst();
  }

  fetchBaseLocationNumberOfRings() {
    return this.sequentialRingServiceInput.getBaseLocationNumberOfRings();
  }

  fetchIsContinueIfBaseLocationIsBusy() {
    return this.sequentialRingServiceInput.getIsContinueIfBaseLocationIsBusy();
  }

  fetchIsCallerMayCancelSearch() {
    return this.sequentialRingServiceInput.getIsCallerMayStopSearch();
  }

  fetchSeqRingArray() {
    return (this.sequentialRingServiceInput.getSeqRingArray());
  }

  fetchCriteriaArray() {
    return (this.sequentialRingServiceInput.getCriteriaArray());
  }

  setIsModified(flag: boolean) {
    this.isModified = flag;
  }
  setDeletePosition(index: number) {
    this.deletePosition = index;
  }

  // Method to construct the XML body to be sent to the XSI....
  constructSequentialRingBody(choice: number) {
    let body = '<?xml version="1.0" encoding="ISO-8859-1"?> <SequentialRing xmlns="http://schema.broadsoft.com/xsi">';
    switch (choice) {
      case 1: body += '<ringBaseLocationFirst>' + this.fetchIsRingBaseLocationFirst() + '</ringBaseLocationFirst>' +
        '<baseLocationNumberOfRings>' + this.fetchBaseLocationNumberOfRings() +
        '</baseLocationNumberOfRings>' + '<continueIfBaseLocationIsBusy>' +
        this.fetchIsContinueIfBaseLocationIsBusy() + '</continueIfBaseLocationIsBusy>';
        break;
      case 2: body += '<callerMayStopSearch>' + this.fetchIsCallerMayCancelSearch() + '</callerMayStopSearch>';
        break;
      case 3: let index = 0;
        if (this.fetchSeqRingArray()) {
          this.fetchSeqRingArray().forEach(element => {
            index++;
            if (element.getNumber() && element.getNumber().trim()) {
              body += '<location' + index + '><address>' + element.getNumber() + '</address><numberOfRings>' +
                element.getNumberOfRing() + '</numberOfRings><answerConfirmationRequired>' +
                element.getIsAnswerConfirmationRequired() + '</answerConfirmationRequired></location' + index + '>';
            }

          });
          if (this.isModified) {  // To find whether the number is deleted...
            body += '<location' + this.deletePosition +
              '><address xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/><numberOfRings>3' +
              '</numberOfRings><answerConfirmationRequired>false' +
              '</answerConfirmationRequired></location' + this.deletePosition + '>';
            this.isModified = false;
            this.deletePosition = 100; // Resetting the pointer, to point no element in the array...
          }
        }
        break;
      case 4: body += '<criteriaActivationList>';
        if (this.fetchCriteriaArray()) {
          this.fetchCriteriaArray().forEach(element => {
            body += '<criteriaActivation><criteriaName>' + element.getName() +
              '</criteriaName><active>' + element.getIsActive() + '</active></criteriaActivation>'
          });
        }
        body += '</criteriaActivationList>'
        break;
    }
    body += '</SequentialRing>'
    return body;
  }

  // Method to Put the values to the XSI...
  sendSequentialRingPut(SequentialRingUrl, postSequentialRingPut, choiceFlag: number) {
    let body = this.constructSequentialRingBody(choiceFlag);
    this.httpservices.httpPutRequest(SequentialRingUrl, body)
      .subscribe((res) => {
        postSequentialRingPut(res)
      }, (err) => {
        postSequentialRingPut(err);
      })
  }

}
