# 📦 BoxApp — Angular PWA for QNAP NAS

BoxApp is a lightweight **Progressive Web App (PWA)** built with Angular. It’s designed to run both on the web (mobile and desktop) and on local QNAP NAS devices, enabling seamless offline support, responsive UI, and interaction with QNAP’s internal API.

---

## 📱 Mobile Installation (PWA)

To install BoxApp on your mobile device:

1. Open the app in your browser:  
   👉 [https://hannaseithe.github.io/boxApp/](https://hannaseithe.github.io/boxApp/)

2. Follow the install prompt:
   - **Android (Chrome)**: Tap the `⋮` menu and select **"Install App"**
   - **iOS (Safari)**: Tap the **Share** button → **"Add to Home Screen"**

3. Once installed, it behaves like a native app with offline capabilities.

---

## 🛠️ Setup on QNAP NAS

(Hint: This app is based on the "File Station HTTP API v5" as documented here: https://eu1.qnap.com/dev/QNAP_QTS_File_Station_API_v5.pdf)
To host and run the app on your QNAP NAS:

### 1. Create `environment.ts`

- Copy `src/environments/environments.example.ts`and save as `src/environments/environment.ts`
- Change the value for apiUrl to the Url of the internal adress of your NAS device and the correct port

e.g.
```ts
export const environment = {
  production: false,
  apiUrl: 'http://123.456.789.10:9000',
};
```

Important: Do not commit this file to version control. Use .gitignore to exclude it.

### 2. Create `nas-config.ts`
- Copy `src/environments/nas-config.example.ts`and save as `src/environments/nas-config.ts`
- Change the values for nasFolderPath, nasUserName, nasPassword, to the shared Folder you want your pictures be uploaded to and a user's name and password that has full permissions on this folder

e.g.
```ts
export const nasConfig = {
    nasFolderPath: '/InventoryPictures',
    nasUserName: 'admin',
    nasPassword: 'Password'
};
```

Important: Do not commit this file to version control. Use .gitignore to exclude it.

### 3. Deploying the App to your QNAP WebServer

#### Activate the web server

Activate your web server in the control panel of QTS

#### 🌍 Build and  to QNAP NAS Web Server


- build the app with 
```bash
ng build --configuration=production
```
    the output will be located in 
    ```
    dist/box-app/browser/
    ```

- upload the files from the output folder of your project to the /Web shared folder of your NAS device
```
Web/boxApp/
```

- access it from your browser
```
http://<your-nas-ip>/boxApp/
```

Hint: Depending on your Qnap Settings you might also have to change the configuration of the Webserver to disable CORS protection (see also: https://www.qnap.com/en/how-to/faq/article/how-do-i-fix-cors-errors-when-accessing-qvr-apis-from-another-server)

## 🚀 Local Development
Clone the repo and run:

```bash
npm install
ng serve
```
Then open:

```
http://localhost:4200
```

## 🧾 License
MIT — Free to use, modify, and distribute.

## 🙋‍♀️ Author
Made by Hanna Seithe