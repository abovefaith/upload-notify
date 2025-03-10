import { Component } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent {
  data$: Observable<number>;

  constructor() {
    this.requestNotificationPermission();
    this.data$ = new Observable<number>((observer) => {
      const intervalSubscription = interval(10000).subscribe(() => {
        const randomValue = Math.random();
        observer.next(randomValue); // Emit a random number every 10 seconds
        this.showNotification('Random Value', `New value: ${randomValue}`); // Show notification
      });

      return () => {
        intervalSubscription.unsubscribe(); // Cleanup when unsubscribed
      };
    });
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((result) => {
        if (result !== 'granted') {
          console.log('Notification permission denied');
        }
      });
    }
  }

  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}
