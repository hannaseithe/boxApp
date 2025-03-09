import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { nasConfig } from '../../environments/nas-config';

/* encode function start */
var ezEncodeChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var ezDecodeChars = new Array(
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  62,
  -1,
  -1,
  -1,
  63,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  -1,
  -1,
  -1,
  -1,
  -1
);

function utf16to8(str: string) {
  var out, i, len, c;
  out = '';
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}
function utf8to16(str: string) {
  var out, i, len, c;
  var char2, char3;

  out = '';
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx10xx xxxx10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
    }
  }
  return out;
}

function ezEncode(str: string) {
  var out, i, len;
  var c1, c2, c3;

  len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += ezEncodeChars.charAt(c1 >> 2);
      out += ezEncodeChars.charAt((c1 & 0x3) << 4);
      out += '==';
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += ezEncodeChars.charAt(c1 >> 2);
      out += ezEncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += ezEncodeChars.charAt((c2 & 0xf) << 2);
      out += '=';
      break;
    }
    c3 = str.charCodeAt(i++);
    out += ezEncodeChars.charAt(c1 >> 2);
    out += ezEncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += ezEncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += ezEncodeChars.charAt(c3 & 0x3f);
  }
  return out;
}

@Injectable({
  providedIn: 'root',
})
export class NasService {
  private apiUrl = environment.apiUrl;
  private sid = '';
  public loggedIn = signal(false);
  public ready = false;

  constructor(private http: HttpClient) {
    if (nasConfig) {
      this.checkNasStatus().subscribe({
        next: (response: any) => {
          if (response.status == 200) {
            this.ready = true;
          }
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    } else {
      console.error(
        'nas-config.ts not implemented. Create file based on nas-config.example.ts'
      );
    }
  }

  checkNasStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cgi-bin/filemanager/authLogin.cgi`, {
      observe: 'response',
      responseType: 'text',
    });
  }

  login(user: string, pwd: string) {
    const baseUrl = `${this.apiUrl}/cgi-bin/filemanager/authLogin.cgi`;

    // Base64 encode the password
    const encodedPassword = ezEncode(utf16to8(pwd)); // Encoding password

    const url = `${baseUrl}?user=${user}&pwd=${encodedPassword}`;

    const headers = new HttpHeaders({
      Accept: 'application/json', // Accept XML response from the server
    });

    const get = this.http.get(url, { headers, responseType: 'text' }).pipe(
      map((response) => this.parseXML(response)), // Parse the XML response
      catchError((error) => {
        console.error('Error during login:', error);
        throw error; // Handle the error accordingly
      })
    );
    get.subscribe({
      next: (response: any) => {
        if (response.QDocRoot.authPassed['#cdata-section'] === '1') {
          this.sid = response.QDocRoot.authSid['#cdata-section'];
          this.loggedIn.set(true);
        }
      },
    });
    return get;
  }

  selfLogin(): Observable<any> {
    return this.login(nasConfig.nasUserName, nasConfig.nasPassword);
  }

  logout(): Observable<any> {
    const baseUrl = `${this.apiUrl}/cgi-bin/filemanager/authLogin.cgi`;
    const url = `${baseUrl}?logout=1&sid=${this.sid}`;
    const headers = new HttpHeaders({
      Accept: 'application/json', // Accept XML response from the server
    });

    const get = this.http.get(url, { headers, responseType: 'text' }).pipe(
      map((response) => this.parseXML(response)), // Parse the XML response
      catchError((error) => {
        console.error('Error during login:', error);
        throw error; // Handle the error accordingly
      })
    );
    get.subscribe({
      next: (response: any) => {
        if (response.QDocRoot.authPassed['#cdata-section'] === '1') {
          this.loggedIn.set(false);
        }
      },
    });
    return get;
  }

  parseXML(xmlText: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    // If the XML response contains errors, we should handle it gracefully
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
      console.error('XML Parsing Error:', errorNode.textContent);
      throw new Error('Failed to parse XML');
    }

    return this.xmlToJson(xmlDoc); // Convert XML to JSON
  }

  // Convert the XML document to a JSON object
  xmlToJson(xml: any): any {
    let obj: any = {};

    // If the node is an element (nodeType === 1)
    if (xml.nodeType === 1) {
      // Process attributes (if any)
      if (xml.attributes.length > 0) {
        for (let i = 0; i < xml.attributes.length; i++) {
          const attribute = xml.attributes.item(i);
          obj[attribute.nodeName] = attribute.nodeValue;
        }
      }
    }
    // If it's a text node (nodeType === 3)
    else if (xml.nodeType === 3) {
      obj = xml.nodeValue;
    }

    // If it has child nodes
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;

        // Handling CDATA: Check if the node is a CDATA section
        if (nodeName === '#cdata-section') {
          obj[nodeName] = item.textContent || item.nodeValue;
        } else {
          // Process as normal child element
          if (obj[nodeName] === undefined) {
            obj[nodeName] = this.xmlToJson(item);
          } else {
            if (Array.isArray(obj[nodeName])) {
              obj[nodeName].push(this.xmlToJson(item));
            } else {
              obj[nodeName] = [obj[nodeName], this.xmlToJson(item)];
            }
          }
        }
      }
    }

    return obj;
  }

  uploadFile(file: File, overwrite: boolean): Observable<any> {
    if (this.loggedIn()) {
      const uploadUrl = `${this.apiUrl}/cgi-bin/filemanager/utilRequest.cgi`;
      const destPath = nasConfig.nasFolderPath;
      const progressPath = `${destPath.replace(/\//g, '-')}-${file.name}`;

      // Construct query parameters
      const params = new HttpParams()
        .set('func', 'upload')
        .set('type', 'standard')
        .set('sid', this.sid)
        .set('dest_path', destPath)
        .set('overwrite', overwrite ? '1' : '0')
        .set('progress', progressPath);

      // Create FormData and append only the file
      const formData = new FormData();
      formData.append('file', file, file.name);

      const headers = new HttpHeaders({
        Accept: 'application/json',
      });

      return this.http.post<any>(
        `${uploadUrl}?${params.toString()}`,
        formData,
        { headers }
      );
    }
    return throwError(() => new Error('User is not logged in'));
  }
  fetchThumbnail(fileName: string, size: 100 | 400 | 800): Observable<any> {
    if (this.loggedIn()) {
      const uploadUrl = `${this.apiUrl}/cgi-bin/filemanager/utilRequest.cgi`;
      const path = nasConfig.nasFolderPath;

      const params = new HttpParams()
        .set('func', 'get_thumb')
        .set('sid', this.sid)
        .set('path', path)
        .set('name', fileName)
        .set('size', size)
        .set('option', 1);

      return this.http.get(`${uploadUrl}?${params.toString()}`, {
        responseType: 'blob' as 'blob',
      });
    }
    return throwError(() => new Error('User is not logged in'));
  }
}
