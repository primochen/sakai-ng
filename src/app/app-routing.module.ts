import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormLayoutComponent } from './components/formlayout/formlayout.component';
import { PanelsComponent } from './components/panels/panels.component';
import { OverlaysComponent } from './components/overlays/overlays.component';
import { MediaComponent } from './components/media/media.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MiscComponent } from './components/misc/misc.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ChartsComponent } from './components/charts/charts.component';
import { FileComponent } from './components/file/file.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { AppMainComponent } from './app.main.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { TableComponent } from './components/table/table.component';
import { ListComponent } from './components/list/list.component';
import { TreeComponent } from './components/tree/tree.component';
import { CrudComponent } from './components/crud/crud.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { FloatLabelComponent } from './components/floatlabel/floatlabel.component';
import { InvalidStateComponent } from './components/invalidstate/invalidstate.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { IconsComponent } from './components/icons/icons.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { AuthGuard } from './core/authentication';
import { UserComponent } from './components/user/user.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                data: {shouldDetach: 'no'},
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                children: [
                    {path: '', component: DashboardComponent},
                    {path: 'pages/user', component: UserComponent,data: {key: 'pages/user'}},
                    {path: 'pages/user/user-detail', component: UserDetailComponent,data: {key: 'pages/user/user-detail'}},
                    {path: 'uikit/formlayout', component: FormLayoutComponent ,data: {key: 'uikit/formlayout'}},
                    {path: 'uikit/input', component: InputComponent,data: {key: 'uikit/input'}},
                    {path: 'uikit/floatlabel', component: FloatLabelComponent,data: {key: 'uikit/floatlabel'}},
                    {path: 'uikit/invalidstate', component: InvalidStateComponent,data: {key: 'uikit/invalidstate'}},
                    {path: 'uikit/button', component: ButtonComponent,data: {key: 'uikit/button'}},
                    {path: 'uikit/table', component: TableComponent,data: {key: 'uikit/table'}},
                    {path: 'uikit/list', component: ListComponent,data: {key: 'uikit/list'}},
                    {path: 'uikit/tree', component: TreeComponent,data: {key: 'uikit/tree'}},
                    {path: 'uikit/panel', component: PanelsComponent,data: {key: 'uikit/panel'}},
                    {path: 'uikit/overlay', component: OverlaysComponent,data: {key: 'uikit/overlay'}},
                    {path: 'uikit/media', component: MediaComponent,data: {key: 'uikit/media'}},
                    {path: 'uikit/menu', loadChildren: () => import('./components/menus/menus.module').then(m => m.MenusModule)},
                    {path: 'uikit/message', component: MessagesComponent},
                    {path: 'uikit/misc', component: MiscComponent},
                    {path: 'uikit/charts', component: ChartsComponent},
                    {path: 'uikit/file', component: FileComponent},
                    {path: 'pages/crud', component: CrudComponent,data: {key: 'pages/crud'}},
                    {path: 'pages/timeline', component: TimelineComponent,data: {key: 'pages/timeline'}},
                    {path: 'pages/empty', component: EmptyComponent,data: {key: 'pages/empty'}},
                    {path: 'icons', component: IconsComponent},
                    {path: 'blocks', component: BlocksComponent},
                    {path: 'documentation', component: DocumentationComponent}
                ],
            },
            {path:'pages/landing', component: LandingComponent,data: {key: 'pages/landing'}},
            {path:'pages/login', component: LoginComponent,data: {key: 'pages/login'}},
            {path:'pages/error', component: ErrorComponent,data: {key: 'pages/error'}},
            {path:'pages/notfound', component: NotfoundComponent,data: {key: 'pages/notfound'}},
            {path:'pages/access', component: AccessComponent,data: {key: 'pages/access'}},
            {path: '**', redirectTo: 'pages/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling:'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
