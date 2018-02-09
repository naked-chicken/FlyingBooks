

// Core components
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// RxJS
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


@Injectable()
export class BookApiService {


    constructor(private http: Http) {


    }

    public getbooksapi(e) {

        return this.http.get('https://www.googleapis.com/books/v1/volumes?q=intitle:' + e + '&maxResults=20&printType=books')
            .toPromise()
            .then(response => response.json())
            .catch(error => console.log('shit happens' + error))
    }

}