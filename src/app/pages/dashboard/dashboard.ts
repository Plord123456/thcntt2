import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms'; // BẮT BUỘC: Import FormsModule cho [(ngModel)]

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // BẮT BUỘC: Thêm FormsModule vào đây
  ],
  providers: [DatePipe], // Cung cấp DatePipe để format ngày tháng
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // Các biến cho thẻ thống kê
  stats = { totalEmployees: 0, attendanceToday: 0, lateToday: 0 };

  // Biến chứa toàn bộ dữ liệu chấm công được hiển thị trên bảng
  chamCongData: any[] = [];

  // Biến để liên kết với date picker, có giá trị khởi tạo là ngày hôm nay
  selectedDate: string;

  isLoading = false; // Biến để hiển thị trạng thái loading

  constructor(
    private apiService: ApiService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    // Khởi tạo giá trị ban đầu cho selectedDate là ngày hôm nay, định dạng YYYY-MM-DD
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadChamCongData(); // Tải dữ liệu chấm công cho ngày hôm nay khi component được khởi tạo
  }

  loadStats(): void {
    this.apiService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });
  }

  // Hàm tải dữ liệu chấm công dựa trên ngày đã chọn
  loadChamCongData(): void {
    if (!this.selectedDate) return;

    this.isLoading = true; // Bắt đầu loading
    this.chamCongData = []; // Xóa dữ liệu cũ

    this.apiService.getAllChamCong(this.selectedDate).subscribe({
      next: data => {
        // Dữ liệu trả về đã được sắp xếp bởi backend
        this.chamCongData = data;
        this.isLoading = false; // Kết thúc loading
      },
      error: err => {
        console.error('Error loading attendance data:', err);
        alert('Không thể tải dữ liệu chấm công. Vui lòng thử lại.');
        this.isLoading = false; // Kết thúc loading dù có lỗi
      }
    });
  }

  // Hàm này được gọi mỗi khi người dùng thay đổi giá trị của date picker
  onDateChange(): void {
    this.loadChamCongData();
  }

  // SỬA LỖI: Hàm điều hướng đến trang quản lý nhân viên
  goToEmployeeManagement(): void {
    this.router.navigate(['/employee-management']);
  }

  logout(): void {
    // Xử lý đăng xuất (ví dụ: xóa token, thông tin user)
    console.log('Logged out');
    this.router.navigate(['/login']);
  }
}
