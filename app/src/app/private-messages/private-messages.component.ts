import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService, Message } from '../services/supabase.service';

interface MessageGroup {
  code: string;
  messages: Message[];
  count: number;
}

@Component({
  selector: 'app-private-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './private-messages.component.html',
  styleUrls: ['./private-messages.component.scss']
})
export class PrivateMessagesComponent implements OnInit {
  messages = signal<Message[]>([]);
  groupedMessages = signal<MessageGroup[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadMessages();
  }

  async loadMessages() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const messages = await this.supabase.getMessages();
      this.messages.set(messages);
      this.groupMessagesByCode(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      this.errorMessage.set('Failed to load messages. Please refresh the page.');
    } finally {
      this.isLoading.set(false);
    }
  }

  groupMessagesByCode(messages: Message[]) {
    const grouped = new Map<string, Message[]>();
    
    messages.forEach(message => {
      if (!grouped.has(message.code)) {
        grouped.set(message.code, []);
      }
      grouped.get(message.code)!.push(message);
    });

    const groupedArray: MessageGroup[] = Array.from(grouped.entries()).map(([code, msgs]) => ({
      code,
      messages: msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      count: msgs.length
    }));

    // Sort by most recent message
    groupedArray.sort((a, b) => {
      const aLatest = new Date(a.messages[0].timestamp).getTime();
      const bLatest = new Date(b.messages[0].timestamp).getTime();
      return bLatest - aLatest;
    });

    this.groupedMessages.set(groupedArray);
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
