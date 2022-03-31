import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from './service/app.menu.service';
import { AppMainComponent } from './app.main.component';
import { TabService } from './service/app.tab.service';
import { AppMenuComponent } from './app.menu.component';

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-menuitem]',
    /* tslint:enable:component-selector */
    template: `
		<ng-container>
			<a [attr.href]="item.url" (click)="itemClick($event)" [ngClass]="item.class"
			   *ngIf="(!item.routerLink || item.items) && item.visible !== false"
			   [attr.target]="item.target" [attr.tabindex]="0" [attr.aria-label]="item.label" role="menuitem" pRipple>
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span>{{item.label}}</span>
				<span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
				<i class="pi pi-fw {{active ? 'pi-angle-up' : 'pi-angle-down'}} ml-auto" *ngIf="item.items"></i>
			</a>
			<a (click)="itemClick($event)" *ngIf="(item.routerLink && !item.items) && item.visible !== false" [ngClass]="item.class"
			   [routerLink]="item.routerLink" routerLinkActive="active-menuitem-routerlink router-link-exact-active"
			   [routerLinkActiveOptions]="{exact: !item.preventExact}" [attr.target]="item.target" [attr.tabindex]="0" [attr.aria-label]="item.label" role="menuitem" pRipple>
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span>{{item.label}}</span>
				<span class="p-tag p-badge ml-auto" *ngIf="item.badge">{{item.badge}}</span>
				<i class="pi pi-fw {{active ? 'pi-angle-up' : 'pi-angle-down'}} ml-auto" *ngIf="item.items"></i>
			</a>
			<ul *ngIf="(item.items && active) && item.visible !== false" [@children]="(active ? 'visibleAnimated' : 'hiddenAnimated')" role="menu">
				<ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
					<li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass" role="none"></li>
				</ng-template>
			</ul>
		</ng-container>
    `,
    host: {
        '[class.active-menuitem]': 'active',
    },
    animations: [
        trigger('children', [
            state('void', style({
                height: '0px'
            })),
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('void => visibleAnimated, visibleAnimated => void',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMenuitemComponent implements OnInit, OnDestroy {

    @Input() item: any;

    @Input() index: number;

    @Input() root: boolean;

    @Input() parentKey: string;

    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string;

    private flattenDeep(arr1) {
        return arr1.reduce((acc, val) => { 
            // console.log(val.items)
            return Array.isArray(val.items) ? acc.concat(this.flattenDeep(val.items)) : acc.concat(val)
        }, []);
     }

    constructor(public app: AppMainComponent,
         public router: Router,
          private cd: ChangeDetectorRef,
          public tabService: TabService,
          public appMenuComponent: AppMenuComponent,
          private menuService: MenuService) {

        //*****************
        let isNotContain = true;
        this.tabService.tabs.forEach(tab => {      
          if (tab.link === this.router.url) {
            isNotContain = false;
          }
        });
        // console.log(isNotContain)
        // console.log(this.router.url)
        // console.log(this.tabService.tabs)        
        // console.log(this.appMenuComponent.model)    
        // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#browser_compatibility

        if(isNotContain)
        {
            let tabArray = this.flattenDeep(this.appMenuComponent.model);
            // console.log(tabArray)
            let tabArray2 = tabArray.filter(e => e.routerLink && e.routerLink[0] === this.router.url)
            // console.log(tabArray2)
            // console.log(tabArray2[0].label)
            // console.log(tabArray2[0].routerLink)
            if(tabArray2 && tabArray2[0])
            {
                this.tabService.tabs.push({ label: tabArray2[0].label, link: this.router.url ,isVisible: true, isDisabled: false});
                setTimeout(() => {
                    this.tabService.selectedIndex = this.tabService.tabs.length - 1  
                }, 200);   
            }
        }
        
        //*****************

        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(key => {
            // deactivate current active menu
            if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
                this.active = false;
            }
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                } else {
                    this.active = false;
                }
            });
    }

    ngOnInit() {
        if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }

        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
    }

    updateActiveStateFromRoute() {
        this.active = this.router.isActive(this.item.routerLink[0], this.item.items ? false : true);
    }

    tabSourceSubscription: Subscription;

    onAddTab(label: string, link: string): void {
        let isNotContain = true;
        this.tabService.tabs.forEach(tab => {      
          if (tab.label === label) {
            // this.tabs.splice(index, 1);
            // this.selected.setValue(this.previousTab?.id);
            // this.router.navigate([this.previousTab?.link]);
            // console.log('onAddTab:'+name);
            isNotContain = false;
            // sessionStorage.setItem(this.sessionKey, JSON.stringify(this.previousTab));
          }
        });
        // console.log('isNotContain:'+isNotContain);
        if (isNotContain) {
          // console.log('onAddTab');
          this.tabService.tabs.push({ label, link ,isVisible: true, isDisabled: false});
          // https://stackoverflow.com/questions/49579035/primeng-programmatically-change-tab-when-using-ngfor-on-tabpanel
          // this.changeDetectorRef.detectChanges();
          // this.tabService.selectedIndex = this.tabService.tabs.length - 1  
          setTimeout(() => {
                this.tabService.selectedIndex = this.tabService.tabs.length - 1  
            }, 200);        
        }
        else
        {
        this.tabService.tabs.forEach((tab, index) => {                
            if (tab.label === label) {
                this.tabService.selectedIndex = index
                // this.tabService.onTabStateChange(index)
                // console.log(tab.label+' '+label +' '+index);                  
            }
          });
        } 
    }

    itemClick(event: Event) {
        event.stopPropagation();
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // console.log(this.key) 
        // console.log(this.item) 

        if(this.item.routerLink && this.item.routerLink[0])
        {
           if(this.item.label === 'Login' ||
              this.item.label === 'Landing' ||
              this.item.label === 'Not Found' ||
              this.item.label === 'Access Denied' ||
              this.item.label === 'Error'
             )
           {

           }
           else
           {
              this.onAddTab(this.item.label,this.item.routerLink[0])
           }
        }

        // notify other items
        this.menuService.onMenuStateChange(this.key);

        // execute command
        if (this.item.command) {
            this.item.command({originalEvent: event, item: this.item});
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;
        } else {
            // activate item
            this.active = true;

            // hide overlay menus
            this.app.menuActiveMobile = false;

            if (this.app.isDesktop() && this.app.isOverlay()) {
                this.app.menuInactiveDesktop = true;
            }
        }
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
