import { Routes } from '@angular/router';
import { BoxListComponent } from './box-list/box-list.component';
import { BoxComponent } from './box/box.component';
import { ItemComponent } from './item/item.component';
import { ItemListComponent } from './item-list/item-list.component';
import { AddEditItemComponent } from './add-edit-item/add-edit-item.component';
import { CatListComponent } from './cat-list/cat-list.component';

export const routes: Routes = [
    {
        path: '',
        component: BoxListComponent,
        title: 'Home page',
      },
      {
        path: 'box/:id',
        component: BoxComponent,
        title: 'Box details',
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
        path: 'item-list/:tag',
        component: ItemListComponent,
        title: 'List of Items',
      },
];
