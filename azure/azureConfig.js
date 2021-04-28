
const azureSQL = ()=>{

  const IEnvs= {
    URI: process.env['URI'],
    SQL_USERNAME: process.env['SQL_USERNAME'],
    SQL_PASSWORD: process.env['SQL_PASSWORD'],
    SQL_SERVER: process.env['SQL_SERVER'],
    SQL_DB: process.env['SQL_DB']
  } 

const config = {
  server: IEnvs.SQL_SERVER, // update me
    authentication: {
      type: 'default',
      options: {
        userName: IEnvs.SQL_USERNAME, // update me
        password: IEnvs.SQL_PASSWORD // update me
      },
      type: "default"
    },
    options: {
      database: IEnvs.SQL_DB, //update me
      trustServerCertificate: true,
      encrypt: true
    }
  };

}
  export default azureSQL;