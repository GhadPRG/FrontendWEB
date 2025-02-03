import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Sidebar Related Variables
  private _isSideBarMenuOpened = signal<boolean>(false);

  // Header Related Variables
  private headerText: Subject<string> = new BehaviorSubject<string>("");
  headerText$ = this.headerText.asObservable()

  constructor() { }

  // SideBar Related Function
  setIsSideBarMenuOpened(value: boolean): void { this._isSideBarMenuOpened.set(value); }
  isSideBarMenuOpened(): boolean { return this._isSideBarMenuOpened(); }

  // Header Related Function
  setHeaderText(text: string): void { this.headerText.next(text); }
  getHeaderText(): Observable<string> { return this.headerText$; }

}
