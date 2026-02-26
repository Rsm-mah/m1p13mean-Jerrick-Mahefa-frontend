import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  username: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;

      // Récupérer le nom depuis le token si tu utilises JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.first_name || 'Utilisateur';
      } catch (e) {
        console.error('Erreur lecture token', e);
        this.username = 'Utilisateur';
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/products']);
  }
}