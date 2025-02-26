import { Component } from '@angular/core';
import { JsonPipe, NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import { MatButtonModule } from '@angular/material/button';
import { Box, Cat, Item, Room, uniqueId } from '../app';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-excel-upload',
  standalone: true,
  imports: [NgIf, JsonPipe, MatButtonModule],
  templateUrl: './excel-upload.component.html',
  styleUrl: './excel-upload.component.css',
})
export class ExcelUploadComponent {
  excelData: any[] = [];
  errorLog: string[] = [];

  constructor(private data: StorageService) {}

  allowedColName(name: string) {
    return (
      name == 'name' ||
      'description' ||
      'category' ||
      'tags' ||
      'box' ||
      'room' ||
      '__EMPTY'
    );
  }

  correctFormat(data: any[]) {
    let errorLog: string[] = [];
    let warningLog = [];
    data.forEach((field, index) => {
      if (!('name' in field)) {
        errorLog.push(
          '>name< Field is missing from ' + (index + 1) + '. Item.'
        );
      }
      if (!('box' in field)) {
        errorLog.push('>box< Field is missing from ' + (index + 1) + '. Item.');
      }
      if (('room' in field) && ('box' in field)) {
        errorLog.push('An Item can only be assigned either a box or a room. Not both.')
      }
      for (let key in field) {
        if (key.substring(0, 7) == '__EMPTY') {
          errorLog.push(
            index +
              1 +
              '. Item: Table contains data in column without a name in its first row'
          );
        }
        if (!this.allowedColName(key)) {
          errorLog.push(
            index +
              1 +
              '. Item: ' +
              key +
              ' is not an allowed column Name."name", "description", "category", "tags" and "boxName" are allowed'
          );
        }
      }
    });
    return { result: errorLog.length < 1, errors: errorLog };
  }

  parseNewData(set: any[]) {
    let items: Item[] = [];
    let boxes: Box[] = [];
    let cats: Cat[] = [];
    let rooms: Room[] = [];
    let boxIndex, catIndex, roomIndex;
    let boxId: uniqueId;
    let catId: uniqueId;
    let roomId: uniqueId;
    set.forEach((item) => {
      for (let key in item) {
        item[key] = item[key].toString();
      }

      if ('box' in item) {
        boxIndex = boxes.findIndex((box) => box.name == item.box);
        if (boxIndex == -1) {
          boxId = this.data.generateNewId();
          boxes.push({ id: boxId, name: item.box.toString() });
          item.boxID = boxId;
        } else {
          item.boxID = boxes[boxIndex].id;
        }
      } else if ('room' in item) {
        roomIndex = rooms.findIndex((room) => room.name == item.room);
        if (roomIndex == -1) {
          roomId = this.data.generateNewId();
          rooms.push({ id: roomId, name: item.room.toString() });
          item.roomID = roomId;
        } else {
          item.roomID = rooms[roomIndex].id;
        }
      }

      if ('category' in item) {
        catIndex = cats.findIndex((cat) => cat.name == item.category);
        if (catIndex == -1) {
          catId = this.data.generateNewId();
          cats.push({ id: catId, name: item.category });
          item.catID = catId;
        } else {
          item.catID = cats[catIndex].id;
        }
      }
      if (item.tags) {
        item.tags = item.tags.split(',');
      }
      item.id = this.data.generateNewId();

      items.push(item);
    });

    return {
      boxes: boxes,
      cats: cats,
      items: items,
      rooms: rooms,
    };
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      let test = this.correctFormat(this.excelData);
      if (test.result) {
        let result = this.parseNewData(this.excelData);
        this.data.initializeNewDB(
          result.boxes,
          result.cats,
          result.items,
          result.rooms
        );
      } else {
        this.errorLog = test.errors;
      }
      console.log('Excel data:', this.excelData);
    };
    reader.readAsBinaryString(file);
  }
}
