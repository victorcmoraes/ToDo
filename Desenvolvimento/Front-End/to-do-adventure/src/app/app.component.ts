import { AppService } from './service/app.service';
import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormMissionComponent } from './dialog-form-mission/dialog-form-mission.component';
import Mission from './shared/models/mission-model';
import { DialogWarningsComponent } from './dialog-warnings/dialog-warnings.component';
import { DialogHeroJorneyComponent } from './dialog-hero-jorney/dialog-hero-jorney.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  mission: Mission = {
    'id': 0,
    'title': '',
    'difficulty': '',
    'description': '',
    'deadline': ''
  };

  settedJourney: any;

  missions: any;
  missoesDisponiveis: any = [];
  missoesEmAndamento: any = [];
  missoesConcluidas: any = [];

  startTimer: any;
  rodandoCronometro = false;
  mostrarCronometro = false;
  botaoCronometro = "play_arrow";
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  constructor(
    public dialog: MatDialog,
    public appService: AppService,
    ) {}

  ngOnInit() {
    this.getSettedJourney();
  }

  getSettedJourney() {
    this.appService.getSettedJourney().subscribe(
      data => {
        this.settedJourney = data;
        this.missoesDisponiveis =  this.settedJourney.missions.filter((mission: { status: string; }) => mission.status === 'available');
        this.missoesConcluidas = this.settedJourney.missions.filter((mission: { status: string; }) => mission.status === 'completed');
        this.missoesEmAndamento = this.settedJourney.missions.filter((mission: { status: string; }) => mission.status === 'in progress');
        localStorage.setItem("settedJourney", this.settedJourney.id);
      },
      error => console.error('Não há jornada setada', error)
    );

  }

  drop(event: CdkDragDrop<any[]>, newList: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if(event.container.id == 'in progress') {
        if (this.missoesEmAndamento.length) { return; }
        const array_data = event.previousContainer.data[event.previousIndex].runningTime.split(':');
        this.sec = parseInt(array_data[2]) < 10 ? '0' + parseInt(array_data[2]) : parseInt(array_data[2]);
        this.min = parseInt(array_data[1]) < 10 ? '0' + parseInt(array_data[1]) : parseInt(array_data[1]);
        this.hr = parseInt(array_data[0]) < 10 ? '0' + parseInt(array_data[0]) : parseInt(array_data[0]);
        this.mostrarCronometro = true;
        this.startCronometro();
      }
      if(event.previousContainer.id == 'in progress') {
        this.stopCronometro();
        event.previousContainer.data[event.previousIndex].runningTime = [this.hr, this.min, this.sec].join(':');
        this.mostrarCronometro = false;
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const movedItem = {...event.container.data[event.currentIndex],
        status: newList,
      };
      this.updateMission(movedItem);
    }
  }

  openDialogMission(data: any, isDelete?: boolean, tipoDialog?: string){
    let dialogRef
    if(isDelete){
      dialogRef = this.dialog.open( DialogWarningsComponent, {data});
      dialogRef.afterClosed().subscribe(result => {
        this.getSettedJourney();
      });
      return
    }
    switch (tipoDialog) {
      case 'tarefa':
        dialogRef = this.dialog.open( DialogFormMissionComponent, {data});
        dialogRef.afterClosed().subscribe(result => {
          this.getSettedJourney();
        });
        break;
      case 'jornada':
          dialogRef = this.dialog.open( DialogHeroJorneyComponent);
          dialogRef.afterClosed().subscribe(result => {
            this.getSettedJourney();
          });

        break;
      default:
        break;
    }
  }

  setDeadline(data: string) {
    const array_data = data.split('-');
    return [array_data[2], array_data[1], array_data[0]].join('/');
  }

  updateMission(mission: Mission) {
    this.appService.updateMission(this.settedJourney.id, mission.id, mission).subscribe(response => {
      this.getSettedJourney();
    });
  }

  startCronometro() {
    if(!this.rodandoCronometro) {
      this.rodandoCronometro = true;
      this.botaoCronometro = "pause";
      this.startTimer = setInterval(() => {
        this.sec++;
        this.sec = this.sec < 10 ? '0' + this.sec : this.sec;

        if(this.sec === 60) {
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
        }

        if(this.min === 60) {
          this.hr++;
          this.hr = this.hr < 10 ? '0' + this.hr : this.hr;
          this.min = '0' + 0;
        }
      }, 1000);
    } else {
      this.stopCronometro();
    }
  }

  stopCronometro() {
    clearInterval(this.startTimer);
    this.rodandoCronometro = false;
    this.botaoCronometro = "play_arrow";
  }

  resetCronometro() {
    clearInterval(this.startTimer);
    this.rodandoCronometro = false;
    this.hr = this.min = this.sec = '0' + 0;
  }
}
