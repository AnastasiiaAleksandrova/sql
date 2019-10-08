'use strict';

const Database = require('./database');

const fatalError = err => new Error(`Sorry! ${err.message}`);
// never send err.message to real user, make it logged somewhere


// sql statements can be in capitals
const getAllComputers = 'select id, name, type, amount, price from computer';
const getComputer = 'select id, name, type, amount, price from computer where id=?';
const insertComputer = 'insert into computer (id, name, type, amount, price) values (?, ?, ?, ?, ?)';
const updateComputer = 'update computer set name=?, type=?, amount=? price=? where id=?';
const deleteComputer = 'delete from computer where id=?'

const computervalues = computer => [+computer.id, computer.name, computer.type, +computer.amount, +computer.price];
const computerValuesForUpdate = computer => [computer.name, computer.type, +computer.amount, +computer.price, +computer.id];




module.exports = class ComputerDataStorage {
    constructor() {
        this.computerdb = new Database({
            'host': 'localhost',
            'port': 3306,
            'user': 'ella',
            'password': 'h2VxUiQh',
            'database': 'computerdb'
        })
    }

    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.computerdb.doQuery(getAllComputers);
                resolve(result.queryResult);
            } catch(err) {
                reject(fatalError(err));
            }
        })
    }

    getComputer(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.computerdb.doQuery(getComputer, [+id]) //plus for converting to number just in case
                if (result.queryResult === 0) {
                    reject(new Error('Person unknown'))
                } else {
                    resolve(result.queryResult[0]);
                }
            } catch(err) {
                reject(new Error(`Sorry! ${err.message}`))
            }
        })
    }

    insert(computer) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.computerdb.doQuery(insertComputer, computervalues(computer));
                if (result.queryResult.rowsAffected === 0) {
                    reject(new Error('Nothing was added'))
                } else {
                    resolve(`Computer with ${computer.id} was added`)
                }
            }
            catch(err) {
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }

    update(computer) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.computerdb.doQuery(updateComputer, computerValuesForUpdate(computer));
            
                if (result.queryResult.rowsAffected === 0) {
                    resolve('No data was updated')
                } else {
                    resolve(`Computer with ${computer.id} was updated`);
                }
            }
            catch(err) {
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }

    delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.computerdb.doQuery(deleteComputer, [+id]);
                if (result.queryResult.rowsAffected === 0) {
                    resolve('Nothing deleted')
                } else {
                    resolve(`Computer with id ${id} was deleted`)
                }
            }
            catch(err) {
                reject(new Error(`Sorry! Error. ${err.message}`));
            }
        })
    }
    
}; //end of class
