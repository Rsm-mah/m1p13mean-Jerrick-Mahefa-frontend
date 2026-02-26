import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-create',
  imports: [
    CommonModule, 
    FormsModule, 
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css',
})
export class CategoryCreate implements OnInit {

  category = {
    name: '',
    attributes: [] as any[]
  };

  isEditMode = false;
  categoryId: string | null = null;

  constructor(
    private categorieService: CategoriesService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<CategoryCreate>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.categoryId) {
      this.isEditMode = true;
      this.categoryId = this.data.categoryId;
      this.loadCategory();
    }
  }

  loadCategory() {
    this.categorieService.getCategoryById(this.categoryId!)
      .subscribe({
        next: (res) => {

          const cat = res.category;

          this.category = {
            name: cat.name,
            attributes: (cat.attributes || []).map((attr: any) => ({
              ...attr,
              optionsString: Array.isArray(attr.options)
                ? attr.options.join(',')
                : ''
            }))
          };

          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.error?.message || 'Erreur chargement');
        }
      });
  }


  addAttribute() {
    this.category.attributes.push({
      key: '',
      label: '',
      type: 'string',
      required: false,
      options: [],
      optionsString: '' 
    });
  }

  removeAttribute(index: number) {
    this.category.attributes.splice(index, 1);
  }

  onOptionsChange(attr: any, value: string) {
    attr.optionsString = value;
    attr.options = value.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  submit() {
    const payload = {
      ...this.category,
      attributes: this.category.attributes.map(attr => {
        const { optionsString, ...rest } = attr; 
        if (!['select', 'multiselect'].includes(attr.type)) {
          delete rest.options;
        }
        return rest;
      })
    };

    if (this.isEditMode) {
      this.categorieService.updateCategory(this.categoryId!, payload).subscribe({
        next: () => {
          alert('Catégorie modifiée');
          this.dialogRef.close(true);
        },
        error: err => alert(err.error?.message)
      });
    } else {
      this.categorieService.createCategory(payload).subscribe({
        next: () => {
          alert('Catégorie créée');
          this.dialogRef.close(true);
        },
        error: err => alert(err.error?.message)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  getTitle()    { return this.isEditMode ? 'Modifier la catégorie'          : 'Créer une catégorie'; }
  getSubtitle() { return this.isEditMode ? 'Mettez à jour les attributs'   : 'Définissez les attributs personnalisés'; }
  getButtonText(){ return this.isEditMode ? 'Enregistrer les modifications' : 'Créer la catégorie'; }
}