import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-management.html',
  styleUrls: ['./employee-management.css']
})
export class EmployeeManagementComponent implements OnInit {

  allEmployees: any[] = [];
  filteredEmployees: any[] = [];

  isModalOpen = false; // Chỉ cần 1 biến để điều khiển modal

  currentEmployee: any = {};
  searchTerm: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.apiService.getAllNhanVien().subscribe(data => {
      this.allEmployees = data;
      this.filteredEmployees = data;
    });
  }

  searchEmployees(): void {
    if (!this.searchTerm) {
      this.filteredEmployees = this.allEmployees;
    } else {
      const lowerCaseSearch = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.allEmployees.filter(nv =>
        nv.HoVaTen.toLowerCase().includes(lowerCaseSearch) ||
        nv.RFID.toLowerCase().includes(lowerCaseSearch)
      );
    }
  }

  // --- Logic cho Modal Sửa ---
  openEditModal(employee: any): void {
    this.currentEmployee = { ...employee };
    if (this.currentEmployee.NgaySinh) {
      this.currentEmployee.NgaySinh = new Date(this.currentEmployee.NgaySinh).toISOString().split('T')[0];
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  // Hàm này giờ chỉ còn logic cho việc Cập nhật
  onUpdateSubmit(): void {
    this.apiService.updateNhanVien(this.currentEmployee.RFID, this.currentEmployee).subscribe({
      next: () => {
        alert('Cập nhật thành công!');
        this.loadEmployees();
        this.closeModal();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Cập nhật thất bại!');
      }
    });
  }

  // --- Logic cho Xóa ---
  deleteEmployee(rfid: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      this.apiService.deleteNhanVien(rfid).subscribe({
        next: () => {
          alert('Xóa nhân viên thành công!');
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Lỗi khi xóa:', err);
          alert('Xóa thất bại!');
        }
      });
    }
  }

  // --- Logic cho các nút điều hướng Header ---
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
