import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  readonly id: number;
  readonly text: string;
  readonly actionLabel?: string;
  readonly actionLink?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesState = signal<readonly ToastMessage[]>([]);
  private nextId = 1;

  readonly messages = this.messagesState.asReadonly();

  show(text: string, options?: { actionLabel: string; actionLink: string }): void {
    const id = this.nextId++;
    this.messagesState.update((items) => [
      ...items,
      { id, text, actionLabel: options?.actionLabel, actionLink: options?.actionLink },
    ]);

    const timerId = globalThis.setTimeout(() => this.dismiss(id), 2800);
    void timerId;
  }

  dismiss(id: number): void {
    this.messagesState.update((items) => items.filter((item) => item.id !== id));
  }
}
