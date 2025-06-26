import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// IMPORTANT: Import ReactiveFormsModule
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  // IMPORTANT: Add ReactiveFormsModule to imports
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-management.html',
  styleUrls: ['./employee-management.css']
})
export class EmployeeManagementComponent implements OnInit {

  allEmployees: any[] = [];
  filteredEmployees: any[] = [];
  isModalOpen = false;
  searchTerm: string = '';

  // Create a FormGroup for the employee form
  employeeForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    // Initialize the form
    this.employeeForm = this.fb.group({
      RFID: [{ value: '', disabled: true }], // Keep RFID disabled
      HoVaTen: ['', Validators.required], // Add a required validator
      NgaySinh: [''],
      SoDienThoai: [''],
      Email: ['', Validators.email] // Add an email validator
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.apiService.getAllNhanVien().subscribe(data => {
      this.allEmployees = data;
      this.filteredEmployees = data;
    });
  }

  // (searchEmployees function remains the same)

  openEditModal(employee: any): void {
    // Use patchValue to populate the form
    this.employeeForm.patchValue({
      ...employee,
      NgaySinh: employee.NgaySinh ? new Date(employee.NgaySinh).toISOString().split('T')[0] : ''
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.employeeForm.reset(); // Reset the form when closing
  }

  onUpdateSubmit(): void {
    if (this.employeeForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.employeeForm.markAllAsTouched();
      return;
    }

    // Get the raw value, including the disabled RFID
    const formData = this.employeeForm.getRawValue();

    this.apiService.updateNhanVien(formData.RFID, formData).subscribe({
      next: () => {
        // Replace alert with a better notification system in a real app
        alert('Cập nhật thành công!');
        this.loadEmployees();
        this.closeModal();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Cập nhật thất bại! ' + (err.error?.error || ''));
      }
    });
  }

  // (deleteEmployee, goToDashboard, logout functions remain the same)
}
