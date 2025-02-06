import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {NgClass} from '@angular/common';
import {ThemeService} from '../../../services/theme.service';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';
import {UserInfoInterface} from '../../../utils/types/user.interfaces';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-sidebar-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './dash-sidebar.component.html',
  styleUrl: './dash-sidebar.component.css'
})
export class DashSidebarComponent implements OnInit, AfterViewInit {
  userInfo$: Observable<UserInfoInterface>;
  userFullName!: string
  userInitials!: string
  userEmail!: string
  // SideBar Elements
  @ViewChildren('dropDownButtonForSubMenu') dropDownBtnsRefs!: QueryList<ElementRef>;
  @ViewChild('toggleSidebarButton') toggleSidebarBtnRef!: ElementRef;
  @ViewChild('sidebar') sidebarRef!: ElementRef;
  isDarkMode: boolean = false;

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark
    })
    this.refreshUserData();
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode()
  }

  doLogout(): void {
    this.authService.logout();
  }

  // public sideNavigationLinks = [
  //   {
  //     path: '/dashboard',
  //     label: 'DashBoard',
  //     icon: 'ri-home-5-fill',
  //   },
  //   {
  //     path: '/dashboard/sport',
  //     label: 'Exercise',
  //     icon: 'ri-home-5-fill',
  //   },
  //   {
  //     path: '/dashboard/food',
  //     label: 'Food',
  //     icon: 'ri-home-5-fill',
  //   },
  //   {
  //     path: '/dashboard/notes',
  //     label: 'Notes',
  //     icon: 'ri-home-5-fill',
  //   },
  //   {
  //     path: '/dashboard/calendar',
  //     label: 'Calendar',
  //     icon: 'ri-home-5-fill',
  //   },
  // ]

  constructor(private dashService: DashboardService,
              private themeService: ThemeService,
              private authService: AuthService,
              private userService: UserService) {
    this.userInfo$ = this.userService.getUserInfo$();
  }

  refreshUserData(): void {
    this.userService.refreshUserInfo();
    // Aggiorna i dati locali dopo il refresh
    this.userInfo$ = this.userService.getUserInfo$();
    this.userService.getUserFullName$().subscribe(name => this.userFullName = name);
    this.userService.getUserInitials$().subscribe(initials => this.userInitials = initials);
    this.userService.getUserEmail$().subscribe(email => this.userEmail = email);
  }

  // SideBar Code & Functions
  ngAfterViewInit(): void {

    // Add Drop-Down Functionality
    this.dropDownBtnsRefs.forEach(btnRef => {
      btnRef.nativeElement.addEventListener('click', () => {
        this.toggleSubMenu(btnRef.nativeElement);
      });
    });

    // Add Closing Functionality
    this.toggleSidebarBtnRef.nativeElement.addEventListener('click', () => this.toggleSidebar());
  }

  toggleSubMenu(btn: any): void {

    // If Trying to Open this SubMenus, then Close All Others
    if (!btn.nextSibling.classList.contains('shown')) {
      this.closeAllSubMenus();
    }

    // Open SubMenu - Flip Drop-Down Icon
    btn.nextSibling.classList.toggle('shown');
    btn.children[btn.children.length - 1].classList.toggle('bx-rotate-180');
    this.dashService.setIsSideBarMenuOpened(btn.nextSibling.classList.contains('shown'));

    // If Trying to Open SubMenu while Sidebar closed, then Open Sidebar
    if (this.sidebarRef.nativeElement.classList.contains('closed')) {
      this.sidebarRef.nativeElement.classList.toggle('closed');
      this.toggleSidebarBtnRef.nativeElement.children[0].classList.toggle('bx-rotate-180');
    }

  }

  toggleSidebar(): void {
    // Close Sidebar - Flip Toggle Button Icon
    this.sidebarRef.nativeElement.classList.toggle('closed');
    this.toggleSidebarBtnRef.nativeElement.children[0].classList.toggle('bx-rotate-180');

    // If Trying to Close Sidebar while Any SubMenu opened, then Close All SubMenus
    this.closeAllSubMenus();
  }

  closeAllSubMenus(): void {
    const subMenusOpened = this.sidebarRef.nativeElement.getElementsByClassName('shown');
    Array.from<any>(subMenusOpened).forEach(ul => {
      ul.classList.remove('shown');

      let btn = ul.previousElementSibling;
      btn.children[btn.children.length - 1].classList.remove('bx-rotate-180');
    });
  }

}
