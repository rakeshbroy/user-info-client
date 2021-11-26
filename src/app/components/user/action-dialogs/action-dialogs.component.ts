import { Component, Inject, OnInit } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from "ngx-toastr";
import { UserModel } from "src/app/models/user-model";
import { DataService } from "src/app/services/data-service";
import { AppEvents } from "src/app/enum/events-enum";

@Component({
  selector: 'app-action-dialogs',
  templateUrl: './action-dialogs.component.html',
  styleUrls: ['./action-dialogs.component.css']
})
export class ActionDialogsComponent implements OnInit {

  title: string = '';
  user: UserModel = {};
  action = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, public toastr: ToastrService, public dialogRef: MatDialogRef<ActionDialogsComponent>, public dataService: DataService) {
    this.user = data.body.user;
    this.action = data.model.action;
    this.getTitle();
  }

  ngOnInit(): void {
  }

  onAddFormClick() {
    this.dataService.emitter.emit(AppEvents.AddUser);
  }

  onDeleteFormClick() {
    this.dataService.emitter.emit(AppEvents.DeleteUser);
  }

  onEditFormClick() {
    this.dataService.emitter.emit(AppEvents.EditUser);
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  getTitle() {
    if (this.action === 'add_user') {
      this.title = 'Add User';
    }  else if (this.action === 'delete_form') {
      this.title = 'Delete Form';
    } else if (this.action === 'edit_user') {
      this.title = 'Edit User';
    }
  }

}
