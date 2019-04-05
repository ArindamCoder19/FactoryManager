# factory-management-screens

Install packages before starting the dev server: npm install

#######  To start Development server #######

1)Comment the code within /* START: Uncomment for prod */ and /* END: Uncomment for prod */ in server.js

#To watch changes in the file
2)Open Command Prompt > npm run dev 

#To start the dev server
3)Open another Command prompt window > npm run start

4)//localhost:3000 in browser


####### To deploy codes to bluemix #######

1)Check config.js(path: src/js/util) for the correct API environment

2)Uncomment the code in server.js

#To build files
3)Open command prompt > npm run build

4)Check manifest.yml for the correct UI environment

5)Open command prompt > cf push


