import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { StorageService } from './storage.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportImportService {
  constructor(private data: StorageService) {}
  private prepExcelExport() {
    let result: any[] = [];
    let cats = this.data.Cats();
    let boxes = this.data.Boxes();
    let rooms = this.data.Rooms();
    let items = this.data.Items();
    items.forEach((item) => {
      let itemCatName = cats.find((cat) => cat.id == item.catID)?.name;
      let itemBoxName = boxes.find((box) => box.id == item.boxID)?.name;
      let itemRoomName = rooms.find((room) => room.id == item.roomID)?.name;
      let itemTags = item.tags?.reduce((acc, item) => acc + ', ' + item);
      let prepItem = {
        name: item.name,
        description: item.description,
        category: itemCatName,
        box: itemBoxName,
        room: itemRoomName,
        tags: itemTags,
      };

      result.push(prepItem);
    });
    return result;
  }

  exportToExcel(): void {
    let json = this.prepExcelExport();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'BoxInventory');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  exportToJson(): void {
    let json = {
      boxes: this.data.Boxes(),
      cats: this.data.Cats(),
      items: this.data.Items(),
      rooms: this.data.Rooms()
    }
    this.saveAsJsonFile(JSON.stringify(json), 'BoxBackUp');
  }

  saveAsJsonFile(jsonString: string, fileName: string): void {
    const data: Blob = new Blob([jsonString], { type: 'application/json' });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + '.json'
    );
  }
}
