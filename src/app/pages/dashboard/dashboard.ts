import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // Các biến cho thẻ thống kê
  stats = { totalEmployees: 0, attendanceToday: 0, lateToday: 0 };

  // Danh sách chấm công hiển thị ra bảng
  attendanceRecords: any[] = [];

  // Object chứa các giá trị của bộ lọc
  public filters = {
    search: '',
    date: ''
  };

  public isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    // Mặc định lọc theo ngày hôm nay khi tải trang
    this.filters.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.loadStats();
    this.applyFilters(); // Tải dữ liệu chấm công cho ngày hôm nay
  }

  // Tải các thẻ thống kê
  loadStats(): void {
    this.apiService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });
  }

  // Hàm chính để áp dụng bộ lọc và gọi API
  applyFilters(): void {
    this.isLoading = true;
    this.attendanceRecords = [];

    this.apiService.getAttendanceRecords(this.filters).subscribe({
      next: (data) => {
        this.attendanceRecords = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching attendance records:', err);
        alert('Có lỗi xảy ra khi tải dữ liệu báo cáo.');
        this.isLoading = false;
      }
    });
  }

  // Xóa trắng các bộ lọc và tải lại dữ liệu không giới hạn
  clearFilters(): void {
    this.filters.search = '';
    this.filters.date = '';
    this.applyFilters();
  }

  exportToCsv(): void {
    if (this.attendanceRecords.length === 0) {
      alert("Không có dữ liệu để xuất.");
      return;
    }
    const headers = ['HoVaTen', 'RFID', 'Ngay', 'ThoiGianVao', 'ThoiGianRa', 'Status'];
    const csvData = this.attendanceRecords.map(record =>
      headers.map(header => `"${record[header] || ''}"`).join(',')
    );
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `BaoCaoChamCong_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Điều hướng
  goToEmployeeManagement(): void {
    this.router.navigate(['/employee-management']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
