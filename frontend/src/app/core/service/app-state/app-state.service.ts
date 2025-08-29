import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppStateService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    saveState(key: string, state: any): void {
        if (isPlatformBrowser(this.platformId)) {
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    action: 'SAVE_STATE',
                    key,
                    value: state,
                });
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        }
    }

    getState(key: string): Promise<any> {
        return new Promise((resolve) => {
            if (isPlatformBrowser(this.platformId)) {
                if (
                    navigator.serviceWorker &&
                    navigator.serviceWorker.controller
                ) {
                    const messageChannel = new MessageChannel();
                    messageChannel.port1.onmessage = (event) => {
                        resolve(event.data || null);
                    };

                    navigator.serviceWorker.controller.postMessage(
                        {
                            action: 'GET_STATE',
                            key,
                        },
                        [messageChannel.port2],
                    );
                } else {
                    const state = localStorage.getItem(key);
                    resolve(state ? JSON.parse(state) : null);
                }
            } else {
                resolve(null);
            }
        });
    }
}
