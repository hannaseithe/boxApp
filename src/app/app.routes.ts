import { Routes } from '@angular/router';
import { BoxListComponent } from './components/box-list/box-list.component';
import { BoxComponent } from './components/box/box.component';
import { ItemComponent } from './components/item/item.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { AddEditItemComponent } from './components/add-edit-item/add-edit-item.component';
import { CatListComponent } from './components/cat-list/cat-list.component';
import { AddEditBoxComponent } from './components/add-edit-box/add-edit-box.component';
import { UnassignedItemListComponent } from './components/unassigned-item-list/unassigned-item-list.component';
import { NasLoginComponent } from './components/nas-login/nas-login.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { UnassignedBoxListComponent } from './components/unassigned-box-list/unassigned-box-list.component';

export const routes: Routes = [
  {
    path: '',
    component: RoomListComponent,
    title: 'Home page',
  },
  {
    path: 'room/:id',
    component: BoxListComponent,
    title: 'Room details',
  },
  {
    path: 'box/:id',
    component: BoxComponent,
    title: 'Box details',
  },
  {
    path: 'add-edit-box/:id',
    component: AddEditBoxComponent,
    title: 'Edit Box',
  },
  {
    path: 'add-edit-box',
    component: AddEditBoxComponent,
    title: 'Add Box',
  },
  {
    path: 'cat-list',
    component: CatListComponent,
    title: 'Cat List',
  },
  {
    path: 'item/:id',
    component: ItemComponent,
    title: 'Item details',
  },
  {
    path: 'add-edit-item/:id',
    component: AddEditItemComponent,
    title: 'Item edit form',
  },
  {
    path: 'add-edit-item',
    component: AddEditItemComponent,
    title: 'Item new form',
  },
  {
    path: 'item-list',
    component: ItemListComponent,
    title: 'List of Items',
  },
  {
    path: 'item-list/:tag',
    component: ItemListComponent,
    title: 'List of Items',
  },
  {
    path: 'unassigned-item-list',
    component: UnassignedItemListComponent,
    title: 'List of Unassigned Items',
  },
  {
    path: 'unassigned-box-list',
    component: UnassignedBoxListComponent,
    title: 'List of Unassigned Boxes',
  },
  {
    path: 'nas-login',
    component: NasLoginComponent,
    title: 'Login to NAS',
  },
];
