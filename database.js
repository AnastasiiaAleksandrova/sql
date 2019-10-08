'use strict';

const mariadb = require('mariadb');

module.exports = class Database {
    constructor (options) {
        this.options = options;
    }

    doQuery(sql, params) {
        return new Promise (async (resolve, reject) => {
            let dbconnection;
            try {
                dbconnection = await mariadb.createConnection(this.options);
                const queryResult = await dbconnection.query(sql, params);
                if (typeof queryResult === 'undefined') {
                    reject(new Error('QueryError'));
                } else if (typeof queryResult.affectedRows === 'undefined') {
                    delete queryResult.meta;
                    resolve({
                        queryResult,
                        resultSet: true
                    })
                } else {
                    resolve({
                        queryResult: {
                            rowsAffected: queryResult.affectedRows,
                            numberAdded: queryResult.insertId,
                            status: queryResult.warningsStatus
                        },
                        resultSet: false
                    })
                }

            } catch(err) {
                reject(new Error('SQL-Error:' + err.message));
            } finally {
                if (dbconnection) dbconnection.end();
            }
        })
    }
}