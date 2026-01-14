import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { ManageVideo } from './dialog/manage-video/manage-video';
import { VideoList } from './video-list/video-list';
import { SharedModule } from '../shared/shared-module';
import { MatIcon } from "@angular/material/icon";
import { MatFormField } from "@angular/material/form-field";
import { UserList } from './user-list/user-list';
import { ManageUser } from './dialog/manage-user/manage-user';


@NgModule({
  declarations: [
    ManageVideo,
    VideoList,
    UserList,
    ManageUser,
     
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MatIcon,
    MatFormField
]
})
export class AdminModule { }
