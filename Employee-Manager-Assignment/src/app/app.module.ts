import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { AddUserComponent } from './home/add-user/add-user.component';
import { LoadingSpinnerComponent } from './Shared/loading-spinner/loading-spinner.component';
import { ListUserComponent } from './home/list-user/list-user.component';
import { StatusFilterPipe } from './Filters/status-filter.pipe';
import { RoleFilterPipe } from './Filters/role-filter.pipe';
import { EditUserComponent } from './home/edit-user/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    PageNotFoundComponent,
    ProfileComponent,
    AddUserComponent,
    LoadingSpinnerComponent,
    ListUserComponent,
    StatusFilterPipe,
    RoleFilterPipe,
    EditUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
