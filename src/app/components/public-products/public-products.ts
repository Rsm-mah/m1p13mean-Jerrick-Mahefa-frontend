import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from '../../services/products';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-public-products',
  imports: [
    [Navbar],
    CommonModule,
    RouterLink
    ,FooterComponent
  ],
  templateUrl: './public-products.html',
  styleUrl: './public-products.css',
})
export class PublicProducts implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  selectedCategory: string = 'all';

  currentPage = 1;
  totalPages = 1;
  pageSize = 12;

  constructor(
    private dialog: MatDialog,
    private productsService: ProductsService,
    private categoryService: CategoriesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: res => {
        this.categories = res.categories || res;
        
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur chargement catégories:', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts(categoryId?: string, page: number = 1) {
    this.isLoading = true;
    this.errorMessage = null;

    this.productsService.getProducts(categoryId, page, this.pageSize).subscribe({
      next: (response: any) => {
        this.products = response.products || [];
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur chargement produits:', err);
        this.errorMessage = err.error?.message || 'Erreur de chargement des produits';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadProducts(this.selectedCategory, page);
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;

    if (categoryId === 'all') {
      this.loadProducts();
    } else {
      this.loadProducts(categoryId);
    }
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

  getFirstImage(product: any): string {
    if (product.details?.length > 0 && 
        product.details[0].images?.length > 0) {
      // Vérifier si c'est une URL complète ou un nom de fichier
      const image = product.details[0].images[0];
      if (image.startsWith('http')) {
        return image;
      } else {
        // Si c'est un nom de fichier, construire l'URL
        return `http://localhost:3000/uploads/${image}`;
      }
    }
    return 'https://placehold.co/400x400/e2e8f0/64748b?text=📦';
  }

  getFirstPrice(product: any): number {
    return product.details?.length > 0 ? product.details[0].price : 0;
  }
}
