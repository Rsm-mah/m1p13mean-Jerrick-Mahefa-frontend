import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { BoxesService } from '../../services/boxes';
import { BoxesCreate } from '../boxes-create/boxes-create';
import { AuthAdminService } from '../../services/auth-admin';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatProgressSpinnerModule
  ],
  templateUrl: './boxes.html',
  styleUrls: ['./boxes.css']
})
export class BoxesComponent implements OnInit {
  boxes: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private dialog: MatDialog,
    private boxesService: BoxesService,
    private authService: AuthAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      this.isLoading = false;
      this.errorMessage = "Accès réservé aux administrateurs";
      return;
    }

    this.loadBoxes();
  }

  loadBoxes(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();

    this.boxesService.getAllBox().subscribe({
      next: (res: any) => {
        const list = res?.boxs || (Array.isArray(res) ? res : []);
        this.boxes = list;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des boxes', err);
        this.errorMessage = err?.error?.message || 'Erreur lors du chargement des boxes';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  retry(): void {
    this.loadBoxes();
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(BoxesCreate, {
      width: '600px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'category-modal',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBoxes();
      }
    });
  }

  editBox(box: any): void {
    const dialogRef = this.dialog.open(BoxesCreate, {
      width: '600px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'category-modal',
      data: { box }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBoxes();
      }
    });
  }

  deleteBox(box: any): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      disableClose: true,
      data: {
        title: 'Supprimer le box',
        message: `Voulez-vous vraiment supprimer le box : "${box?.name}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        icon: 'delete',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boxesService.deleteBox(box._id).subscribe({
          next: () => this.loadBoxes(),
          error: (err) => {
            console.error('Erreur lors de la suppression du box', err);
            alert(err?.error?.message || 'Erreur lors de la suppression du box');
          }
        });
      }
    });
  }
}
