import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ApiService} from '../../services/api';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false; // Khởi tạo là false, Rất tốt!

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  onSubmit(): void {
    // 1. Kiểm tra validation trước
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin.';
      return; // Chỉ hiện lỗi và thoát, không làm gì thêm
    }

    // 2. MỌI THỨ HỢP LỆ -> BẮT ĐẦU QUÁ TRÌNH GỬI ĐI
    this.isLoading = true;    // <-- Bật loading ở ĐÂY
    this.errorMessage = '';   // <-- Xóa thông báo lỗi cũ đi

    const credentials = {
      username: this.username,
      password: this.password
    };

    this.apiService.login(credentials).subscribe({
      // Trường hợp đăng nhập thành công
      next: (response) => {
        this.isLoading = false; // <-- Tắt loading khi xong
        console.log('Đăng nhập thành công:', response);
        this.router.navigate(['/dashboard']);
      },
      // Trường hợp có lỗi từ server
      error: (err) => {
        this.isLoading = false; // <-- Tắt loading khi có lỗi
        console.error('Lỗi đăng nhập:', err);
        this.errorMessage = err.error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      }
    });
  }
}
