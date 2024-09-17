import Web3 from 'web3';

import { Injectable } from '@angular/core';

interface Window {
    ethereum: any;
}

1;

@Injectable({
    providedIn: 'root',
})
export class Web3Service {
    // private web3!: Web3;
    // public window!: Window;
    // constructor() {
    //     if (window.ethereum) {
    //         this.web3 = new Web3(window.ethereum);
    //         window.ethereum.enable();
    //     } else {
    //         console.warn('MetaMask not detected. Please install MetaMask.');
    //     }
    // }
    // public async getAccounts(): Promise<string[]> {
    //     return await this.web3.eth.getAccounts();
    // }
    // Добавьте другие методы для взаимодействия с контрактами
}
