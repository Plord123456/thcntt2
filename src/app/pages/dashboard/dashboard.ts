import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import {ApiService} from '../../services/api';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, // Cần cho *ngFor, *ngIf, | date
    FormsModule   // Cần cho [(ngModel)]
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  public chamCongData: any[] = [];
  public filteredData: any[] = [];
  public searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }
  goToEmployeeManagement(): void {
    this.router.navigate(['/employee-management']);
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.apiService.getAllChamCong().subscribe({
      next: (data) => {
        this.chamCongData = data;
        this.filteredData = data;
      },
      error: (err) => console.error('Lỗi khi tải dữ liệu:', err)
    });
  }


  search(): void {
    if (!this.searchTerm) {
      this.filteredData = this.chamCongData;
      return;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredData = this.chamCongData.filter(record =>
      record.HoVaTen?.toLowerCase().includes(lowerCaseSearchTerm) ||
      record.RFID?.toLowerCase().includes(lowerCaseSearchTerm) ||
      record.Ngay?.toString().toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCaoChamCong');
    XLSX.writeFile(wb, 'BaoCaoChamCong.xlsx');
  }


  logout(): void {
    this.router.navigate(['/login']);
  }
}
