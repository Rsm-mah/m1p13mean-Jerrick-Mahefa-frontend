import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ShopsService } from '../../services/shops';

@Component({
  selector: 'app-shop-create',
  imports: [CommonModule, FormsModule, MatDividerModule, MatIconModule],
  templateUrl: './shop-create.html',
  styleUrl: './shop-create.css',
})
export class ShopCreate implements OnInit {
  shop = {
    name: '',
    email: '',
    phone: '',
  };

  isEditMode = false;
  shopId: string | null = null;
  isSubmitting = false;

  constructor(
    private shopsService: ShopsService,
    public dialogRef: MatDialogRef<ShopCreate>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.shop?._id) {
      this.isEditMode = true;
      this.shopId = this.data.shop._id;

      this.shop = {
        name: this.data.shop?.name || '',
        email: this.data.shop?.contacts?.email || '',
        phone: this.data.shop?.contacts?.phone || '',
      };
    }
  }

  submit(): void {
    if (!this.shop.name) {
      alert('Le nom est obligatoire');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.shopId) {
      const payload = {
        name: this.shop.name,
        contacts: {
          email: this.shop.email,
          phone: this.shop.phone,
        },
      };

      this.shopsService.updateShop(this.shopId, payload).subscribe({
        next: () => {
          alert('Boutique modifiée');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Erreur');
          this.isSubmitting = false;
        },
      });

      return;
    }

    const payload = {
      name: this.shop.name,
      email: this.shop.email,
      phone: this.shop.phone,
    };

    this.shopsService.createShop(payload).subscribe({
      next: () => {
        alert('Boutique créée');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Erreur');
        this.isSubmitting = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getTitle() {
    return this.isEditMode ? 'Modifier la boutique' : 'Créer une boutique';
  }

  getSubtitle() {
    return this.isEditMode
      ? 'Mettez à jour les informations'
      : 'Renseignez les informations de la boutique';
  }

  getButtonText() {
    return this.isEditMode ? 'Enregistrer les modifications' : 'Créer la boutique';
  }
}
