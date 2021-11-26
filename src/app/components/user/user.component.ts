import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionDialogsComponent } from './action-dialogs/action-dialogs.component';
import * as _ from 'lodash';
import { Subscription } from "rxjs";
import { DataService } from 'src/app/services/data-service';
import { AppEvents } from 'src/app/enum/events-enum';
import { UrlsConfig } from 'src/app/config/urls-config';
import axios from 'axios';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'mobile', 'actions'];
  user: any = {};
  users: any; 
  public subscription!: Subscription;

  constructor(public toastr: ToastrService, public dialog: MatDialog, public dataService: DataService) { }

  ngOnInit(): void {
    this.callApiToGetUsers();
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

  openDialogWithDeleteUser(user: UserModel) {
    this.user = _.clone(user);
    this.openDialog('delete_form');
  }

  callApiToGetUsers() {
    axios.get(UrlsConfig.listUsers)
    .then(result => {
      if (!result.data.error) {
        this.users = result.data.data.users;
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  callApiToAddUser() {
    console.log(this.user);
    if (!this.isFormValid()) {
      return;
    }
    const req = {
      ...this.user
    }
    axios.post(UrlsConfig.addUser, req)
    .then(result => {
      if (!result.data.error) {
        this.toastr.success('User added successfully');
        this.callApiToGetUsers();
        this.dialog.closeAll();
      } else {
        this.toastr.error(result.data.message);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
  callApiToDeleteUser() {
    const req = {
      ...this.user
    }
    axios.post(UrlsConfig.deleteUser, req)
    .then(result => {
      if (!result.data.error) {
        this.toastr.success(result.data.message);
        this.callApiToGetUsers();
        this.dialog.closeAll();
      } else {
        this.toastr.error(result.data.message);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
  callApiToEditUser() {
    if (!this.isFormValid()) {
      return
    }
    const req = {
      ...this.user
    }
    axios.post(UrlsConfig.UpdateUser, req)
    .then(result => {
      if (!result.data.error) {
        this.toastr.success(result.data.message);
        this.callApiToGetUsers();
        this.dialog.closeAll();
      } else {
        this.toastr.error(result.data.message);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isFormValid() {
    if(_.isEmpty(this.user.firstName)) {
      this.toastr.error('First name cant be empty');
      return false;
    }
    if(_.isEmpty(this.user.lastName)) {
      this.toastr.error('Last name cant be empty');
      return false;
    }
    if(_.isEmpty(this.user.email)) {
      this.toastr.error('Email cant be empty');
      return false;
    }
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.user.email)) {
      this.toastr.error('Enter a valid email id');
      return false;
    }
    if (!/[1-9][0-9]{9}/.test(this.user.mobile)) {
      this.toastr.error('Enter 10 digit phone number');
      return false;
    }
    if (this.user.password?.length < 8) {
      this.toastr.error('Password must have min. 8 chars.');
      return false;
    }
    if (!/[0-9]+/.test(this.user.password)) {
      this.toastr.error('Password must have at least one number');
      return false;
    }
    if (!/[A-Z]+/.test(this.user.password)) {
      this.toastr.error('Password must have at least 1 uppercase character');
      return false;
    }
    if (!/[!@#\$%\^\&*\)\(+=._-]+/.test(this.user.password)) {
      this.toastr.error('Password must have at least 1 special character');
      return false;
    }
    if (/\s+/.test(this.user.password)) {
      this.toastr.error('Password Cannot contain a whitespace');
      return false;
    }
    if (!_.isEqual(this.user.password, this.user.confirmPassword)) {
      this.toastr.error('Password did not match to the confirm password');
      return false;
    }
    return true;
  }

}
