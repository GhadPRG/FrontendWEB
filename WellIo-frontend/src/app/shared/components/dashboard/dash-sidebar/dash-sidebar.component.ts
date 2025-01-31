import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-sidebar-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dash-sidebar.component.html',
  styleUrl: './dash-sidebar.component.css'
})
export class DashSidebarComponent implements AfterViewInit {
  
  // SideBar Elements
  @ViewChildren('dropDownButtonForSubMenu') dropDownBtnsRefs!: QueryList<ElementRef>;
  @ViewChild('toggleSidebarButton') toggleSidebarBtnRef!: ElementRef;
  @ViewChild('sidebar') sidebarRef!: ElementRef;


  public sideNavigationLinks = [
    {
      path: '/dashboard',
      label: 'DashBoard',
      icon: 'ri-home-5-fill',
    },
    {
      path: '/dashboard/sport',
      label: 'Exercise',
      icon: 'ri-home-5-fill',
    },
    {
      path: '/dashboard/food',
      label: 'Food',
      icon: 'ri-home-5-fill',
    },
    {
      path: '/dashboard/notes',
      label: 'Notes',
      icon: 'ri-home-5-fill',
    },
    {
      path: '/dashboard/calendar',
      label: 'Calendar',
      icon: 'ri-home-5-fill',
    },
  ]

  constructor(private dashService: DashboardService) {}

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
