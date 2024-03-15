import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TileselectorComponent } from './map/Controls/tileselector/tileselector.component';
import { MapillaryViewerModalComponent } from './map/Controls/mapillary-viewer-modal/mapillary-viewer-modal.component';
import { MapillaryDataComponent } from './map/Controls/mapillary-data/mapillary-data.component';
import { MapillaryDataModalComponent } from './map/Controls/mapillary-data-modal/mapillary-data-modal.component';
import { MapModeComponent } from './map/Controls/map-mode/map-mode.component';
import { OpacitySliderComponent } from './map/Controls/opacity-slider/opacity-slider.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ZoominoutComponent } from './map/Controls/zoominout/zoominout.component';
import { PopupComponent } from './map/Controls/popup/popup.component';
import { TranslateService } from './shared/translate/translate.service';
import { TranslateComponent } from './shared/translate/translate.component';
import { TranslatePipe } from './shared/translate/translate.pipe';
import { DarkThemeComponent } from './shared/dark-theme/dark-theme.component';
import { SensorsGraphComponent } from './map/Controls/sensors-tab-layout/sensors-graph/sensors-graph.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { SensorsTabLayoutComponent } from './map/Controls/sensors-tab-layout/sensors-tab-layout.component';
import { SensorsCardComponent } from './map/Controls/sensors-tab-layout/sensors-card/sensors-card.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ResponsesComponent } from './responses/responses.component';
import { TeamComponent } from './team/team.component';
import { MapStatsDataComponent } from './map/Controls/map-stats-data/map-stats-data.component';
import { MapStatsDataModalComponent } from './map/Controls/map-stats-data-modal/map-stats-data-modal.component';
import { MapStatsThemmaticComponent } from './map/Controls/map-stats-data-modal/map-stats-themmatic/map-stats-themmatic.component';
import { MapStatsFiltersComponent } from './map/Controls/map-stats-data-modal/map-stats-filters/map-stats-filters.component';
import { NgxColorsModule } from 'ngx-colors';
import {
  MoreInfoDialog,
  MyFilterPipe,
  NeighborhoodsComponent,
} from './neighborhoods/neighborhoods.component';
import { StrategyComponent } from './strategy/strategy.component';
import {
  DescIndicesDialog,
  IndicesComponent,
  MoreInfoIndicesDialog,
  indicesFilterPipe,
} from './indices/indices.component';
import { ContextMenuComponent } from './map/Controls/context-menu/context-menu.component';
import { MapShareComponent } from './map/Controls/map-share/map-share.component';
import { MapShareModalComponent } from './map/Controls/map-share-modal/map-share-modal.component';
import { TourMatMenuModule, TourService } from 'ngx-ui-tour-md-menu';
import { MyTourService } from './my-tour.service';
import { AddressFinderComponent } from './shared/address-finder/address-finder.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EventDialogComponent } from './shared/event-dialog/event-dialog.component';
import { EventsComponent } from './events/events.component';

export function setupTranslateFactory(service: TranslateService): Function {
  return () => service.use('gr');
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TileselectorComponent,
    MapillaryViewerModalComponent,
    MapillaryDataComponent,
    MapillaryDataModalComponent,
    MapModeComponent,
    OpacitySliderComponent,
    ZoominoutComponent,
    PopupComponent,
    TranslateComponent,
    TranslatePipe,
    DarkThemeComponent,
    SensorsGraphComponent,
    SensorsTabLayoutComponent,
    SensorsCardComponent,
    HomeComponent,
    AboutComponent,
    ResponsesComponent,
    TeamComponent,
    ContactComponent,
    MapStatsDataComponent,
    MapStatsDataModalComponent,
    MapStatsThemmaticComponent,
    MapStatsFiltersComponent,
    NeighborhoodsComponent,
    MyFilterPipe,
    StrategyComponent,
    IndicesComponent,
    indicesFilterPipe,
    MoreInfoDialog,
    MoreInfoIndicesDialog,
    DescIndicesDialog,
    ContextMenuComponent,
    MapShareComponent,
    MapShareModalComponent,
    AddressFinderComponent,
    EventDialogComponent,
    EventsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatListModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatStepperModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatExpansionModule,
    MatSlideToggleModule,
    DragDropModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCardModule,
    NgxColorsModule,
    TourMatMenuModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCardModule,
    MatAutocompleteModule,
    NgxColorsModule,
  ],
  providers: [
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true,
    },
    MyTourService,
    TourService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
