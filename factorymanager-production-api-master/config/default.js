
/**
Description of the Keys - 
db: Database connection URL //ex: 'mongodb://<username>:<password>@<address>:<port>/compose?authSource=admin&ssl=true'
URL: API url //ex: "https://<API-url>.mybluemix.net"
mailId: Your paid account ID //ex: 'abc@in.ibm.com'
*/



// Update Application specific URLs

/*============Dev/Test/Prod Environment==========*/
var dbConfig = {
   db: 'mongodb://admin:ODIFTASYJJFAQPFO@portal-ssl636-49.bmix-dal-yp-0007f670-3435-4bf1-b50c-14f2c6e6c6c1.4036567508.composedb.com:18335/compose?authSource=admin&ssl=true',
   "secret":"api-demo-secret",
 
  "URL": "https://factorymanager12012019.mybluemix.net",
  //  "URL": "http://localhost:4200",
   "mailId": 'arikotal@in.ibm.com'
}
/*============Dev/Test/Prod Environment==========*/

// SEND GRID: 
//API NAME: ibmdigitalindia
//API KEY: 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
//   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             w7OWnHZkRDKEQ5x9lpvd9A
//SEND GRID : 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
// https://prod-factory-management-api11012019.us-east.mybluemix.net/
//https://factorymanager11012019.us-east.mybluemix.net/
module.exports = dbConfig;
