import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  /**
   * Sends login credentials to the backend.
   * @param credentials Object with username and password.
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers });
  }

  getAllChamCong(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllChamCong`);
  }

  getLateEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getLateEmployees`);
  }

  // LẤY DANH SÁCH TẤT CẢ NHÂN VIÊN
  getAllNhanVien(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nhanvien`);
  }

  // LẤY THÔNG TIN CỦA MỘT NHÂN VIÊN THEO RFID
  getNhanVienById(rfid: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/nhanvien/${rfid}`);
  }
  updateNhanVien(rfid: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateNV/${rfid}`, data);
  }
deleteNhanVien(rfid: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteNV/${rfid}`);
}
  addNhanVien(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNV`, data);
  }

}
