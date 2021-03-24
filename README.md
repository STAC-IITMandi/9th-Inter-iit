# 9th-Inter-IIT

## Instructions for running Webapp.

1. Install Python dependencies `pip3 install -r requirements.txt`
2. Ensure that you have node and npm installed on your system.
3. Run `npm install` to install node dependencies
4. Run `npm start`
5. Application will be running at [http://127.0.0.1:8080](http://127.0.0.1:8080)

## Documentation

Please checkout the documentation in `docs` folder.

## Instructions for users running Standalone App

### For running standalone app (WINDOWS USERS ONLY)

Run the `ISRO_data_visualisation_tool.exe` file, install it.
Inside there are two apps that must be run sequentially for node application to work. Also, data directory must be present in the root project directory for node app to work.

1. `data2json.exe` (must be run first, will analyse data and create json files.)
2. `server-win.exe`
   Then, run `server-win.exe` and app will be running on localhost `http://127.0.0.1:8000/`

#### Note:- In case exe file is identified as a threat by antivirus or windows defender security

1. To Open `Windows Security` or press window + I
2. Go to `update Security` -> `Virus And threat protection`.
3. Under `Virus And threat protection` settings, click on manage settings
4. Under `Exclusion` click on `Add or remove Exclusion` and add `C:\Users\<username>\Downloads` or the path where you are to download the file.
5. If you want to keep exe file in any other folder just add that folder here as shown in the steps above.

### On Linux and Mac

1. On terminal, run `pip3 install -r requirements.txt`
2. Run `python cat_json.py` to create json files.
3. Now with data directory present in same folder as executable You can run the app.

### Requirements for linux and Mac users:-

1. python3 and pip3
