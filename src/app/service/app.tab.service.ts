import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class TabService {

    public tabs: SidenavRouteInterface[] = [{ label: 'Dashboard', link: '/',isVisible: true, isDisabled: false}]
    public selectedIndex: number = 0

}

export interface SidenavRouteInterface {
    label: string;
    link: string;
    icon?: string;
    isVisible: boolean
    isDisabled: boolean
  }
