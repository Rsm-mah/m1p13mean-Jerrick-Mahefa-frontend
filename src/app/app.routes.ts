import { Routes } from '@angular/router';
import { LoginAdmin } from './components/login-admin/login-admin';
import { Layout } from './layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Products } from './components/products/products';
import { Category } from './components/category/category';
import { Customers } from './components/customers/customers';
import { PublicProducts } from './components/public-products/public-products';
import { PublicProductDetail } from './components/public-product-detail/public-product-detail';
import { PublicCart } from './components/public-cart/public-cart';
import { PublicLogin } from './components/public-login/public-login';
import { PublicRegister } from './components/public-register/public-register';
import { PublicOrders } from './components/public-orders/public-orders';
import { PublicOrdersDetail } from './components/public-orders-detail/public-orders-detail';
import { PublicProfil } from './components/public-profil/public-profil';
import { Orders } from './components/orders/orders';
import { OrdersDetail } from './components/orders-detail/orders-detail';
import { BoxesComponent } from './components/boxes/boxes';
import { Shops } from './components/shops/shops';

export const routes: Routes = [
  // --- Login ---
  { path: 'login-admin', component: LoginAdmin },

  // --- Admin routes ---
  {
    path: 'admin',
    component: Layout,
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'categories', component: Category },
      { path: 'products', component: Products },
      { path: 'orders', component: Orders },
      { path: 'orders/detail/:id', component: OrdersDetail },
      { path: 'customers', component: Customers },
      { path: 'shops', component: Shops },
      { path: 'boxes', component: BoxesComponent },
    ]
  },

  // --- Public client routes ---
  {
    path: '',
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'login', component: PublicLogin },
      { path: 'inscription', component: PublicRegister },
      { path: 'products', component: PublicProducts },
      { path: 'products-detail/:id', component: PublicProductDetail },
      { path: 'cart', component: PublicCart },
      { path: 'orders', component: PublicOrders },
      { path: 'orders-detail/:id', component: PublicOrdersDetail },
      { path: 'profile', component: PublicProfil },
    ]
  },

  // --- Legacy redirections admin ---
  { path: 'categories', redirectTo: '/admin/categories' },
  { path: 'products', redirectTo: '/admin/products' },

  // --- 404 fallback ---
  { path: '**', redirectTo: 'products' }
];