import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoxesService } from '../../services/boxes';
import { ShopsService } from '../../services/shops';

@Component({
  selector: 'app-boxes-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDividerModule, MatIconModule],
  templateUrl: './boxes-create.html',
  styleUrls: ['./boxes-create.css']
})
export class BoxesCreate implements OnInit {
  model: any = { name: '', loyer: 0, shopId: '' };
  shops: any[] = [];
  isEditMode = false;
  boxId: string | null = null;
  isSubmitting = false;

  constructor(
    private boxesService: BoxesService,
    private shopsService: ShopsService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<BoxesCreate>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const box = this.data?.box;
    if (box?._id) {
      this.isEditMode = true;
      this.boxId = box._id;
      this.model = {
        name: box.name ?? '',
        loyer: box.loyer ?? 0,
        shopId: box.shopId ?? ''
      };
    }

    this.loadShops();
  }

  loadShops(): void {
    this.shopsService.getAllShops().subscribe({
      next: (res: any) => {
        this.shops = res?.shops || (Array.isArray(res) ? res : []);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement boutiques:', err);
        this.shops = [];
      }
    });
  }

  submit(): void {
    this.isSubmitting = true;

    const payload = {
      name: this.model.name,
      loyer: this.model.loyer,
      shopId: this.model.shopId ? this.model.shopId : null
    };

    if (this.isEditMode && this.boxId) {
      this.boxesService.updateBox(this.boxId, payload).subscribe({
        next: () => {
          alert('Box modifié');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Erreur lors de la modification du box', err);
          alert(err?.error?.message || 'Erreur');
          this.isSubmitting = false;
        }
      });
      return;
    }

    this.boxesService.createBox(payload).subscribe({
      next: () => {
        alert('Box créée');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erreur lors de la création du box', err);
        alert(err?.error?.message || 'Erreur');
        this.isSubmitting = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getTitle() {
    return this.isEditMode ? 'Modifier le box' : 'Créer un Box';
  }

  getSubtitle() {
    return this.isEditMode
      ? 'Mettez à jour les informations'
      : 'Ajoutez un nouveau box pour la boutique';
  }

  getButtonText() {
    return this.isEditMode ? 'Enregistrer les modifications' : 'Enregistrer';
  }
}
