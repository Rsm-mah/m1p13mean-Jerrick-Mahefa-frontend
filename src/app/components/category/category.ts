import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../services/categories';
import { CommonModule } from '@angular/common';
import { CategoryCreate } from '../category-create/category-create';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit{
  categories: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private readonly AVATAR_CLASSES = [
    'avatar-indigo',
    'avatar-rose',
    'avatar-emerald',
    'avatar-amber',
    'avatar-sky',
  ];

  constructor(
    private dialog: MatDialog,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef
  ) {}

  avatarClass(index: number): string {
    return this.AVATAR_CLASSES[index % this.AVATAR_CLASSES.length];
  }
  
  ngOnInit(): void {
    this.loadCategories()
  }

  retry(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Force la détection de changement
    this.cdr.detectChanges();
    
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        console.log('Réponse reçue:', response);
        
        if (response && response.categories) {
          this.categories = response.categories;
        } else if (Array.isArray(response)) {
          this.categories = response;
        }
        
        this.isLoading = false;
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.errorMessage = err.error?.message || 'Erreur de chargement des catégories';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CategoryCreate, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'category-modal',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  deleteCategory(category: any) {
    console.log(category);
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      disableClose: true,
      data: {
        title: 'Supprimer la catégorie',
        message: `Voulez-vous vraiment supprimer la catégorie : "${category.name}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        icon: 'delete',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.deleteCategory(category._id).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: err => {
            console.error(err);
          }
        });
      }
    });
  }


  editCategory(category: any): void {
    const dialogRef = this.dialog.open(CategoryCreate, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'category-modal',
      data: { 
        categoryId: category._id 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }
}
