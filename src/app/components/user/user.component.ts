import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionDialogsComponent } from './action-dialogs/action-dialogs.component';
import * as _ from 'lodash';
import { Subscription } from "rxjs";
import { DataService } from 'src/app/services/data-service';
import { AppEvents } from 'src/app/enum/events-enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'mobile', 'actions'];
  user: UserModel = {};
  users: [UserModel] = [
    {id: 1, firstName: 'Rakesh', lastName: 'Kumar', email: 'rkrakesh133@gmail.com', mobile: '9709374758'},
  ]; 
  public subscription!: Subscription;

  constructor(public toastr: ToastrService, public dialog: MatDialog, public dataService: DataService) { }

  ngOnInit(): void {
    this.subscription = this.dataService.emitter.subscribe((event: AppEvents) => {
      if (event === AppEvents.AddUser) {
        this.callApiToAddUser()
      } else if (event === AppEvents.DeleteUser) {
        this.callApiToDeleteUser();
      } else if (event == AppEvents.EditUser) {
        this.callApiToEditUser();
      }
    });
  }

  openDialog(action: string): void {
    let dialogRef = this.dialog.open(ActionDialogsComponent, {
      width: '300px',
      data: {
        model: {
          title: 'Add User',
          action
        },
        body: {
          user: this.user,
        }
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.user = {};
    })
  }

  openDialogWithEditUser(user: UserModel) {
    this.user = _.clone(user);
    this.openDialog('edit_user');
  }

  callApiToAddUser() {
    console.log(this.user);
  }
  callApiToDeleteUser() {
    console.log('deleting user');
  }
  callApiToEditUser() {
    console.log(this.user);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
