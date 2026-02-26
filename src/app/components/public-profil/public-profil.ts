import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomersService } from '../../services/customers';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-profil',
  imports: [
    [Navbar],
    FormsModule,
    CommonModule
  ],
  templateUrl: './public-profil.html',
  styleUrl: './public-profil.css',
})
export class PublicProfil implements OnInit{
  profile: any = null;
  loading = true;
  editing = false;

  constructor(
    private customerService: CustomersService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.customerService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.customer;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        // si erreur, déconnexion
        this.logout();
      }
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  saveProfile(data: any) {
    this.customerService.updateCustomer(data).subscribe({
      next: (res) => {
        this.profile = res.customer;

        this.editing = false;
        this.loadProfile();
      },
      error: (err) => console.error(err)
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    this.customerService.changePassword({ oldPassword, newPassword }).subscribe({
      next: () => alert('Mot de passe changé !'),
      error: (err) => alert(err.error.message || 'Erreur lors du changement')
    });
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      data: {
        title: 'Supprimer le compte',
        message: 'Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.',
        type: 'danger',
        icon: 'warning',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // si l'utilisateur confirme
        this.customerService.deleteAccount().subscribe({
          next: () => {
            alert('Compte supprimé avec succès');
            this.logout();
          },
          error: (err) => alert(err.error.message || 'Erreur lors de la suppression')
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/products']);
  }
}
