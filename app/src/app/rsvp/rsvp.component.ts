import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService, Guest } from '../services/supabase.service';

interface Message {
  code: string;
  message: string;
  timestamp: string;
}

@Component({
  selector: 'app-rsvp', 
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss'],
  providers: []
})
export class RsvpComponent implements OnInit {
  searchTerm = signal('');
  message = signal('');
  submitSuccess = signal(false);
  submitError = signal('');
  isLoading = signal(false);
  isInitialLoading = signal(true);
  
  guests = signal<Guest[]>([]);
  // Store original database state to check if guest already submitted
  originalGuestsState = signal<Guest[]>([]);
  
  private errorTimeout: ReturnType<typeof setTimeout> | null = null;
  private successTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    this.isInitialLoading.set(true);
    try {
      const guests = await this.supabase.getGuests();
      this.guests.set(guests);
      // Store a deep copy of the original state
      this.originalGuestsState.set(JSON.parse(JSON.stringify(guests)));
    } catch (error) {
      console.error('Error loading guests:', error);
      this.showError('Failed to load guests. Please refresh the page.');
    } finally {
      this.isInitialLoading.set(false);
    }
  }

  get filteredGuests() {
    const search = this.searchTerm().toLowerCase().trim();
    // Don't show any guests if search is empty
    if (!search) {
      return [];
    }
    // Filter by exact unique code to show all guests in the same group/family
    return this.guests().filter(guest => 
      guest.code.toLowerCase() === search
    );
  }

  // Check if a guest was already answered in the database (not just locally)
  isGuestAnsweredInDB(guestId: number): boolean {
    const originalGuest = this.originalGuestsState().find(g => g.id === guestId);
    return originalGuest ? originalGuest.attending !== null : false;
  }

  get allGuestsAnswered() {
    const filtered = this.filteredGuests;
    // If no guests are filtered, don't disable
    if (filtered.length === 0) {
      return false;
    }
    // Check if all filtered guests have answered in the DATABASE (original state)
    return filtered.every(guest => this.isGuestAnsweredInDB(guest.id));
  }

  /** True when the user has changed at least one checkbox in the current session */
  get hasNewSelection(): boolean {
    const filtered = this.filteredGuests;
    if (filtered.length === 0) return false;
    return filtered.some(guest => {
      // Only count guests that weren't already answered in DB
      if (this.isGuestAnsweredInDB(guest.id)) return false;
      return guest.attending !== null;
    });
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onMessageChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.message.set(value);
  }

  clearError() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
    this.submitError.set('');
  }

  clearSuccess() {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = null;
    }
    this.submitSuccess.set(false);
  }

  showSuccess() {
    this.submitSuccess.set(true);

    // Auto-dismiss after 10 seconds
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
    this.successTimeout = setTimeout(() => {
      this.submitSuccess.set(false);
      this.successTimeout = null;
    }, 10000);
  }

  showError(message: string) {
    // Clear any existing timeout
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    
    this.submitError.set(message);
    
    // Auto-dismiss after 10 seconds
    this.errorTimeout = setTimeout(() => {
      this.submitError.set('');
      this.errorTimeout = null;
    }, 10000);
  }

  updateAttendance(guestId: number, attending: boolean) {
    this.guests.update(guests => 
      guests.map(guest => 
        guest.id === guestId ? { ...guest, attending } : guest
      )
    );
  }

  async submitRSVP() {
    const code = this.searchTerm().trim();
    
    // Validate that a search code has been entered
    if (!code) {
      this.showError('Please enter your invitation code first.');
      return;
    }

    // Get the filtered guests for this code
    const guestsToUpdate = this.filteredGuests;
    
    if (guestsToUpdate.length === 0) {
      this.showError('No guests found with this code.');
      return;
    }

    // If all guests already answered, just navigate to info page
    if (this.allGuestsAnswered) {
      // Save message if provided (user can still add messages)
      const messageText = this.message().trim();
      if (messageText) {
        this.isLoading.set(true);
        try {
          await this.supabase.addMessage(code.toUpperCase(), messageText);
        } catch (error) {
          console.error('Error saving message:', error);
        } finally {
          this.isLoading.set(false);
        }
      }
      // Navigate to info page directly
      this.router.navigate(['/info']);
      return;
    }

    // Validate that at least one attendance option is selected
    const hasSelection = guestsToUpdate.some(guest => guest.attending !== null);
    if (!hasSelection) {
      this.showError('Please select attending or not attending for at least one guest.');
      return;
    }

    this.isLoading.set(true);
    this.clearError();
    this.submitSuccess.set(false);

    try {
      // Update each guest's attendance
      for (const guest of guestsToUpdate) {
        if (guest.attending !== null) {
          await this.supabase.updateGuest(guest.id, guest.attending);
        }
      }

      // Save message if provided
      const messageText = this.message().trim();
      if (messageText) {
        await this.supabase.addMessage(code.toUpperCase(), messageText);
      }

      this.showSuccess();
      this.clearError();
      console.log('RSVP submitted successfully');
      
      // Update original state after successful submission
      this.originalGuestsState.set(JSON.parse(JSON.stringify(this.guests())));
      
      // Redirect to info page after successful submission
      setTimeout(() => {
        this.router.navigate(['/info']);
      }, 1500);

    } catch (error) {
      console.error('Error submitting RSVP:', error);
      this.showError('Failed to submit RSVP. Please try again.');
      this.submitSuccess.set(false);
    } finally {
      this.isLoading.set(false);
    }
  }
}
