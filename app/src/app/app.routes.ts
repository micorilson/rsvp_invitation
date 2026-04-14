import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'rsvp',
    loadComponent: () => import('./rsvp/rsvp.component').then(m => m.RsvpComponent)
  },
  {
    path: 'info',
    loadComponent: () => import('./info/info.component').then(m => m.InfoComponent)
  },
  {
    path: 'private-guests',
    loadComponent: () => import('./private-guests/private-guests.component').then(m => m.PrivateGuestsComponent)
  },
  {
    path: 'private-messages',
    loadComponent: () => import('./private-messages/private-messages.component').then(m => m.PrivateMessagesComponent)
  }
];
