import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8081'; // URL backend của bạn

  constructor(private http: HttpClient) { }

  /**
   * Lấy danh sách chấm công.
   * @param date - Ngày cần lọc, định dạng YYYY-MM-DD. Nếu không có, sẽ lấy tất cả.
   */
  getAttendanceRecords(filters: { date?: string, search?: string }): Observable<any[]> {
    let params = new HttpParams();

    if (filters.date) {
      params = params.set('date', filters.date);
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<any[]>(`${this.baseUrl}/getAllChamCong`, { params });
  }

  getAllNhanVien(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/nhanvien`);
  }
  getAllChamCong(date?: string): Observable<any[]> {
    let params = new HttpParams();
    if (date) {
      // Thêm tham số 'date' vào request nếu nó được cung cấp
      params = params.append('date', date);
    }
    // Gửi request GET với tham số
    return this.http.get<any[]>(`${this.baseUrl}/getAllChamCong`, { params });
  }


  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard/stats`);
  }

  updateNhanVien(rfid: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateNV/${rfid}`, data);
  }

  deleteNhanVien(rfid: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteNV/${rfid}`);
  }

  // Thêm các hàm API khác nếu cần
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
}
