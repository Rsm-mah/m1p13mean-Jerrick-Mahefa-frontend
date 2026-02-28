import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-public-product-detail',
  standalone: true,
  imports: [
    Navbar,
    CommonModule,
    FooterComponent,
  ],
  templateUrl: './public-product-detail.html',
  styleUrl: './public-product-detail.css',
})
export class PublicProductDetail implements OnInit {

  productId!: string;
  product: any;
  selectedDetail: any;
  currentImage!: string;
  quantity: number = 1;

  // Pour le choix de taille uniquement (optionnel)
  selectedSize?: string;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  loadProduct(): void {
    this.isLoading = true;

    this.productService.getProductById(this.productId).subscribe({
      next: (response: any) => {
        const productData = response.products || response;
        this.product = productData;

        // Sélection automatique du détail
        if (productData.details?.length > 0) {

          // Si le produit a des tailles
          const firstDetailWithSize = productData.details.find((d: any) => d.attributes.size);
          if (firstDetailWithSize) {
            this.selectedSize = firstDetailWithSize.attributes.size;
            this.updateSelectedDetail();
          } else {
            // Sinon on prend simplement le premier détail
            this.selectedDetail = productData.details[0];
            this.currentImage = this.selectedDetail.images?.[0];
            this.quantity = 1;
          }
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement produit:', err);
        this.isLoading = false;
      }
    });
  }

  changeImage(img: string): void {
    this.currentImage = img;
  }

  increaseQty(): void {
    if (this.quantity < this.selectedDetail?.stock) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // ---------- Gestion taille ----------
  get availableSizes(): string[] {
    if (!this.product?.details) return [];
    return Array.from(new Set(
      this.product.details
        .map((d: any) => d.attributes.size)
        .filter((s: any) => s !== undefined)
    ));
  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.updateSelectedDetail();
  }

  updateSelectedDetail() {
    if (!this.selectedSize) return;

    const detail = this.product.details.find((d: any) =>
      d.attributes.size === this.selectedSize
    );

    if (detail) {
      this.selectedDetail = detail;
      this.currentImage = detail.images?.[0];
      this.quantity = 1;
    } else {
      // fallback : prendre le premier détail si la taille n'existe pas
      this.selectedDetail = this.product.details[0];
      this.currentImage = this.selectedDetail.images?.[0];
      this.quantity = 1;
    }
  }

  addToCart() {
    if (!this.selectedDetail) return;

    this.cartService.addToCart({
      id: this.product._id,
      name: this.product.name,
      category: this.product.categoryId?.name || '',
      shop: this.product.shopId?.name || '',
      shopId: this.product.shopId?._id,
      price: this.selectedDetail.price,
      quantity: this.quantity,
      attributes: this.selectedDetail.attributes,
      image: this.selectedDetail.images?.[0] || '',
      addedAt: Date.now()
    });

    alert('Produit ajouté au panier !');
  }
}