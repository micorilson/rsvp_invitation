import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService, Guest } from '../services/supabase.service';

@Component({
  selector: 'app-private-guests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-guests.component.html',
  styleUrls: ['./private-guests.component.scss']
})
export class PrivateGuestsComponent implements OnInit {
  guests = signal<Guest[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadGuests();
  }

  async loadGuests() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const guests = await this.supabase.getGuests();
      this.guests.set(guests);
    } catch (error) {
      console.error('Error loading guests:', error);
      this.errorMessage.set('Failed to load guests. Please refresh the page.');
    } finally {
      this.isLoading.set(false);
    }
  }

  getAttendingStatus(attending: boolean | null): string {
    if (attending === true) return 'Yes';
    if (attending === false) return 'No';
    return 'Pending';
  }

  getAttendingClass(attending: boolean | null): string {
    if (attending === true) return 'status-yes';
    if (attending === false) return 'status-no';
    return 'status-pending';
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
