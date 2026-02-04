import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    getAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.apiUrl}/addresses`);
    }

    addAddress(address: Address): Observable<any> {
        return this.http.post(`${this.apiUrl}/addresses`, address);
    }
}
