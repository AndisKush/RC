import firebird from "node-firebird";

const dbOptions = {
    host: '127.0.0.1',
    port: 3050,
    database: 'D:\\RC\\banco\\RCDATA.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true,
    role: null,
    pageSize: 16384

};

function executeQuery(ssql, params, callback){
     firebird.attach(dbOptions, function(err, db){
        if(err){
            return callback(err, []);
        }
        db.query(ssql, params, function(err, result){

            db.detach();
            if(err){
                return callback(err, []);
            } else{
                return callback(undefined, result);
            }
        })
    });
}

export { executeQuery };
//export { dbOptions };