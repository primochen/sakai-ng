import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class TabService {

    public tabs: SidenavRouteInterface[] = [{ label: 'Dashboard', link: '',isVisible: true, isDisabled: false}];
    public selectedIndex: number = 0;

    // private tabSource = new Subject<number>();
    // tabSource$ = this.tabSource.asObservable();    

    // onTabStateChange(key: number) {
    //     this.tabSource.next(key);
    // }
}

export interface SidenavRouteInterface {
    label: string;
    link: string;
    icon?: string;
    isVisible: boolean;
    isDisabled: boolean
  }
