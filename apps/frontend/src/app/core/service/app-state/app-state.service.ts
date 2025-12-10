import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppStateService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async saveState(key: string, state: any): Promise<void> {
        if (!this.isBrowser) {
            console.log('SSR environment - skipping saveState');
            return;
        }

        try {
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    action: 'SAVE_STATE',
                    key,
                    value: state,
                });
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    async getState(key: string): Promise<any> {
        if (!this.isBrowser) {
            console.log('SSR environment - returning null for getState');
            return null;
        }

        return new Promise((resolve) => {
            try {
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
            } catch (error) {
                console.error('Error getting state:', error);
                resolve(null);
            }
        });
    }
}
