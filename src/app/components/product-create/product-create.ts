import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriesService } from '../../services/categories';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-create.html',
  styleUrls: ['./product-create.css']
})
export class ProductCreate implements OnInit {
  categories: any[] = [];
  selectedCategory: any;
  selectedFiles: File[] = [];
  previewImages: string[] = [];
  isLoading = false;
  isLoadingCategories = true;
  isEditMode = false;
  productId: string | null = null;

  product = {
    categoryId: '',
    name: '',
    description: '',
    details: [
      {
        attributes: {} as Record<string, any>,
        price: 0,
        stock: 0,
        images: [] as string[]
      }
    ]
  };

  constructor(
    private categoryService: CategoriesService,
    private productService: ProductsService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ProductCreate>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Vérifier si on est en mode édition
    if (data && data.productId) {
      this.isEditMode = true;
      this.productId = data.productId;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadCategories();
    });
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: res => {
        this.categories = res.categories || res;
        this.isLoadingCategories = false;
        
        // Si on est en mode édition, charger les données du produit
        if (this.isEditMode && this.productId) {
          this.loadProductData();
        }
        
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur chargement catégories:', err);
        this.isLoadingCategories = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Charger les données du produit pour édition
  loadProductData() {
  this.isLoading = true;
  this.productService.getProductById(this.productId!).subscribe({
    next: (response: any) => {
      console.log('Réponse API:', response); // DEBUG
      
      // CORRECTION: La réponse est { products: {...} } pas directement le produit
      const productData = response.products || response;
      
      // Vérification de sécurité
      if (!productData) {
        console.error('Aucune donnée produit reçue');
        return;
      }

      // Vérifier que categoryId existe et a un _id
      const categoryId = productData.categoryId?._id || productData.categoryId;
      
      if (!categoryId) {
        console.error('CategoryId manquant');
        return;
      }

      // Remplir le formulaire avec les données existantes
      this.product = {
        categoryId: categoryId,  // Maintenant sécurisé
        name: productData.name || '',
        description: productData.description || '',
        details: productData.details?.map((detail: any) => ({
          ...detail,
          attributes: { ...(detail.attributes || {}) },
          price: detail.price || 0,
          stock: detail.stock || 0,
          images: detail.images || []
        })) || [{ attributes: {}, price: 0, stock: 0, images: [] }]
      };

      // Sélectionner la catégorie et charger ses attributs
      this.selectedCategory = this.categories.find(
        c => c._id === this.product.categoryId
      );

      // Charger les images existantes pour prévisualisation
      if (productData.details?.[0]?.images?.length > 0) {
        this.previewImages = [...productData.details[0].images];
      }

      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erreur chargement produit:', err);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  onCategoryChange() {
    this.selectedCategory = this.categories.find(
      c => c._id === this.product.categoryId
    );
    
    // Ne pas réinitialiser les attributs en mode édition si on change de catégorie
    if (!this.isEditMode) {
      this.product.details[0].attributes = {};
    }
  }

  onFileChange(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
      
      // Ajouter les nouvelles previews sans effacer les existantes
      const newPreviews: string[] = [];
      
      const fileReaders = this.selectedFiles.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = (e: any) => {
            resolve(e.target.result);
          };
          
          reader.onerror = () => {
            reject('Erreur de lecture du fichier');
          };
          
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders)
        .then((results) => {
          this.previewImages = [...this.previewImages, ...results];
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error('Erreur lors du chargement des images:', error);
        });
    }
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
    
    // Si c'est une image existante (URL) et pas un nouveau fichier
    if (!this.previewImages[index]?.startsWith('data:')) {
      // Marquer l'image pour suppression
      if (!this.product.details[0].images) {
        this.product.details[0].images = [];
      }
      // Vous pouvez gérer ici la suppression d'images existantes
    }
  }

  submit() {
    if (!this.product.name || !this.product.categoryId || !this.product.details[0].price) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();

    formData.append('categoryId', this.product.categoryId);
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('details', JSON.stringify(this.product.details));

    // Ajouter les nouvelles images
    for (let file of this.selectedFiles) {
      formData.append('images', file);
    }

    // Ajouter les URLs des images existantes à conserver
    const existingImages = this.previewImages.filter(img => img.startsWith('http'));
    if (existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    const request = this.isEditMode
      ? this.productService.updateProduct(this.productId!, formData)
      : this.productService.createProduct(formData);

    request.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialogRef.close({
          ...response,
          mode: this.isEditMode ? 'edit' : 'create'
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert(err.error?.message || `Erreur lors de la ${this.isEditMode ? 'modification' : 'création'} du produit`);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  // Titre dynamique selon le mode
  getTitle(): string {
    return this.isEditMode ? 'Modifier le produit' : 'Créer un produit';
  }

  getSubtitle(): string {
    return this.isEditMode 
      ? 'Modifiez les informations de votre produit' 
      : 'Ajoutez un nouveau produit à votre catalogue';
  }

  getButtonText(): string {
    return this.isEditMode ? 'Mettre à jour' : 'Créer le produit';
  }
}