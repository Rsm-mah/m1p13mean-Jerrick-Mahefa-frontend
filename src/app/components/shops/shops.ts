import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { ShopsService } from '../../services/shops';
import { ShopCreate } from '../shop-create/shop-create';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { AuthAdminService } from '../../services/auth-admin';

@Component({
  selector: 'app-shops',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './shops.html',
  styleUrl: './shops.css',
})
export class Shops implements OnInit {
  shops: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private dialog: MatDialog,
    private shopsService: ShopsService,
    private authService: AuthAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      this.isLoading = false;
      this.errorMessage = 'Accès réservé aux administrateurs';
      return;
    }

    this.loadShops();
  }

  retry(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.cdr.detectChanges();

    this.shopsService.getAllShops().subscribe({
      next: (response) => {
        if (response && response.shops) {
          this.shops = response.shops;
        } else if (Array.isArray(response)) {
          this.shops = response as any;
        } else {
          this.shops = [];
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement boutiques:', err);
        this.errorMessage = err.error?.message || 'Erreur de chargement des boutiques';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(ShopCreate, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'category-modal',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadShops();
      }
    });
  }

  editShop(shop: any): void {
    const dialogRef = this.dialog.open(ShopCreate, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'category-modal',
      data: { shop },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadShops();
      }
    });
  }

  deleteShop(shop: any): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      disableClose: true,
      data: {
        title: 'Supprimer la boutique',
        message: `Voulez-vous vraiment supprimer la boutique : "${shop?.name}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        icon: 'delete',
        type: 'danger',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.shopsService.deleteShop(shop._id).subscribe({
          next: () => this.loadShops(),
          error: (err) => {
            console.error(err);
            alert(err.error?.message || 'Erreur suppression');
          },
        });
      }
    });
  }
}
