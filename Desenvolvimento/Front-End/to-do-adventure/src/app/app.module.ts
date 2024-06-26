import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogWarningsComponent } from './dialog-warnings/dialog-warnings.component';
import { DialogHeroJorneyComponent } from './dialog-hero-jorney/dialog-hero-jorney.component';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop'
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion'



@NgModule({
  declarations: [
    AppComponent,
    DialogFormMissionComponent,
    DialogWarningsComponent,
    DialogHeroJorneyComponent
  ],
  entryComponents:[DialogFormMissionComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
