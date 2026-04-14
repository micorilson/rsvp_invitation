import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Guest {
  id: number;
  name: string;
  code: string;
  attending: boolean | null;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id?: number;
  code: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  // Get all guests
  async getGuests(): Promise<Guest[]> {
    const { data, error } = await this.supabase
      .from('guests')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
    return data || [];
  }

  // Get guests by code
  async getGuestsByCode(code: string): Promise<Guest[]> {
    const { data, error } = await this.supabase
      .from('guests')
      .select('*')
      .eq('code', code.toUpperCase());
    
    if (error) {
      console.error('Error fetching guests by code:', error);
      throw error;
    }
    return data || [];
  }

  // Update guest attendance
  async updateGuest(id: number, attending: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('guests')
      .update({ 
        attending, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  }

  // Add message (allows multiple messages per code)
  async addMessage(code: string, message: string): Promise<void> {
    const { error } = await this.supabase
      .from('messages')
      .insert({ 
        code: code.toUpperCase(), 
        message, 
        timestamp: new Date().toISOString() 
      });
    
    if (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  // Get all messages
  async getMessages(): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    return data || [];
  }

  // Get messages by code (can return multiple)
  async getMessagesByCode(code: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('code', code.toUpperCase())
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    return data || [];
  }
}
