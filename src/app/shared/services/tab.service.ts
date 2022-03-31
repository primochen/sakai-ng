import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  // messages: string[] = [];
  public tabs: SidenavRouteInterface[] = [{ name: 'menu.dashboard', link: '/dashboard' }];
  // [
  //   { id: 6, name: '儀錶板', link: 'dashboard' },
  //   { id: 7, name: '表單元素', link: 'forms/elements' },
  //   { id: 8, name: '媒體畫廊', link: 'media/gallery' },
  // ];

  // remove(tab: SidenavRouteInterface) {
  //   // this.push(tab);
  // }

  // add(tab: SidenavRouteInterface) {
  //   this.tabs.push(tab);
  // }

  // clear() {
  //   this.tabs = [];
  // }
}

export interface SidenavRouteInterface {
  name: string;
  link: string;
  icon?: string;
}
