import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Sidebar Variables
  _isSideBarMenuOpened = signal<boolean>(false);

  constructor() { }

  // SideBar Function
  setIsSideBarMenuOpened(value: boolean): void {
    this._isSideBarMenuOpened.set(value);
  }

  isSideBarMenuOpened(): boolean {
    return this._isSideBarMenuOpened();
  }
}
