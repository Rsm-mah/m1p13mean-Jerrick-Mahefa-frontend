// pages/products/products.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCreate } from '../product-create/product-create';
import { ProductsService } from '../../services/products';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FooterComponent
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {
  products: any[] = [];
  categories: string[] = [];
  selectedCategory = 'All';
  isLoading = true;
  errorMessage: string | null = null;

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  totalProducts = 0;

  constructor(
    private dialog: MatDialog,
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.currentPage = page;

    const user = localStorage.getItem('user');
    const userDetails = user ? JSON.parse(user) : null;

    const role = userDetails?.role;

    if (role === 'SHOP') {
      this.productsService.getProductByShopId().subscribe({
        next: (response) => {
          const allProducts = response?.products || (Array.isArray(response) ? response : []);
          this.totalProducts = allProducts.length;
          this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
          const start = (this.currentPage - 1) * this.pageSize;
          this.products = allProducts.slice(start, start + this.pageSize);
          this.extractCategories();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement produits (shop):', err);
          this.errorMessage = err.error?.message || 'Erreur de chargement des produits';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const categoryParam = this.selectedCategory === 'All' ? undefined : this.selectedCategory;
      this.productsService.getProducts(categoryParam, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          if (response?.products) {
            this.products = response.products;
            this.totalPages = response.totalPages ?? 1;
            this.totalProducts = response.totalProducts ?? (response.products?.length || 0);
          } else if (Array.isArray(response)) {
            // fallback
            this.products = response;
            this.totalProducts = response.length;
            this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
          }

          this.extractCategories();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement produits:', err);
          this.errorMessage = err.error?.message || 'Erreur de chargement des produits';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  extractCategories(): void {
    const uniqueCategories = new Set<string>();
    this.products.forEach(product => {
      if (product.categoryId?.name) {
        uniqueCategories.add(product.categoryId.name);
      }
    });
    this.categories = Array.from(uniqueCategories);
    console.log('Catégories extraites:', this.categories);
  }

  getFirstImage(product: any): string {
    if (product.details?.length > 0 && 
        product.details[0].images?.length > 0) {
      // Vérifier si c'est une URL complète ou un nom de fichier
      const image = product.details[0].images[0];
      if (image.startsWith('http')) {
        return image;
      } else {
        return `http://localhost:3000/uploads/${image}`;
      }
    }
    return 'https://placehold.co/400x400/e2e8f0/64748b?text=📦';
  }

  getFirstPrice(product: any): number {
    return product.details?.length > 0 ? product.details[0].price : 0;
  }

  getTotalStock(product: any): number {
    return product.details?.reduce((total: number, detail: any) => 
      total + (detail.stock || 0), 0) || 0;
  }

  getBadge(product: any): string | null {
    if (!product.createdAt) return null;
    
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 7) {
      return 'Nouveau';
    }
    return null;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    // reset to first page when changing category
    this.loadProducts(1);
  }

  getFilteredProducts(): any[] {
    if (this.selectedCategory === 'All') {
      return this.products;
    }
    return this.products.filter(product => 
      product.categoryId?.name === this.selectedCategory
    );
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(ProductCreate, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'product-modal',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: any): void {
    const dialogRef = this.dialog.open(ProductCreate, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'product-modal',
      data: { 
        productId: product._id 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(product: any): void {
    if (confirm(`Voulez-vous vraiment supprimer "${product.name}" ?`)) {
      console.log('Delete product:', product);
    }
  }

  retry(): void {
    this.loadProducts();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadProducts(page);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.changePage(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.changePage(this.currentPage + 1);
  }
}