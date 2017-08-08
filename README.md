# CallSettingsWebview


NOTE : Replace the <b>IP-Address</b> referred throughout with the IP address of the machine where the dev environment is to be setup. IP address is to be used when the application has to be accessed from a different machine or a phone while the setup is done in a different machine. Alternatively, 127.0.0.1 can be used when the setup is on the same machine where the application is accessed from.


----------------------------------------------------------------------------------------------------------------------------------------
Steps to setup development environment :
----------------------------------------------------------------------------------------------------------------------------------------
Check out the CallSettingsWeb code base

Make the below modifications in the files to run the application in dev mode.
1. (WebContent/angular2/).angular-cli.json  - In this file the apps.index property value should be index.html
                    "index": "index.html"
2. (WebContent/angular2/src/)index.html - This file launches the application. The XSP URL, UserId and Password for the user that is to be used in dev mode are to be set in this file.
3. Set the "devModeCallSettingsJSON.userId" to the userId that the dev environment will run upon.
4. Set the "devModePwd" property with the password for the userId.
5. Set the "xsiActionsBaseURL" window variable to the Xsi-Actions URL in the XSP that is to be used for testing.
6. Set the "devModeCallSettingsJSON.deviceMobileNo" to the number that should be used for the BroadWorksAnywhere service Mobile identity.
7. The "index.html" simulates the input from a UC application. The "devModeCallSettingsJSON" JSON object simulates the UC One input JSON. 
8. The customizedTexts JSON object is the one used by the application for the different text and label in the application in dev mode.
To simulate branding, branding.css is to be modified. Any changes made to branding has to be carried forward to the customStyle.css.template with the placeholders as that is to be replaced with.
9. In the “angular2/WenContent/CallSettingsWeb” folder, open a command prompt terminal and execute the command:
                         <b> >npm install </b> <br>
This will install all the necessary packages and modules for running the angular codes listed in the “package.json” file. A folder named “node_modules” will be created.
10. From the same command prompt terminal within the “angular2” folder execute the command:
                      <b> >ng serve </b> <br>
This will compile the code and run it in the local machine, which can be viewed by hitting http://<b>IP-Address</b>:4200 in the browser. <br>                   
11. To host the application in the local machine and to access it from other devices, we have to get the current ipv4 address of the hosting machine and in the same command prompt terminal within the “angular2” folder execute the following command:
                   <b> >ng serve - -host ipv4 address</b>      (Note: The consecutive ‘-‘ has no spaces in between.)
12. After the successful execution of the above command, the web application hosted in the local machine can be accessed by hitting “<b>ipv4 address of the local machine</b>:4200”.


----------------------------------------------------------------------------------------------------------------------------------------
Steps to build the application
----------------------------------------------------------------------------------------------------------------------------------------
1. In the “angular2/WebContent/CallSettingsWeb” folder, open a command prompt terminal and execute the command:
             <b>    >npm install </b> <br>
                   This will install all the necessary packages and modules for running the angular codes listed in the “package.json” file. A folder named “node_modules” will be created. <br>
2. The application version is updated in the “build.properties” file inside the “build” folder.
3. (WebContent/angular2/).angular-cli.json  - In this file the apps.index property value should be <b>"../cswindex.jsp" </b> <br>
                    <b> "index": "../cswindex.jsp" </b> <br>
Ensure that the above entry is present. If this is not set, the generated war will not open the application.
4. Open a command prompt terminal in the “build” folder execute the command:
              <br> <b> >ant </b> <br>
This builds the “BWCallSetingsWeb_<version_number>.war” file inside the “dist’ folder. <br>
This “BWCallSetingsWeb_<version_number>.war” is deployed in XSP.
<br><br><br>

Please refer to the document for setup and other details :
http://xchange.broadsoft.com/php/xchange/system/files/Release_23/ReleaseDocs/FeatureDescriptions/CallSettingsWebViewFD-R230.pdf
