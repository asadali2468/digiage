// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* tslint:disable:no-console */
import { SQLiteDB } from '@classes/sqlitedb';
/**
 * Class to mock the interaction with the SQLite database.
 */
var SQLiteDBMock = /** @class */ (function (_super) {
    __extends(SQLiteDBMock, _super);
    /**
     * Create and open the database.
     *
     * @param name Database name.
     */
    function SQLiteDBMock(name) {
        var _this = _super.call(this, name, null, null) || this;
        _this.name = name;
        return _this;
    }
    /**
     * Close the database.
     *
     * @return Promise resolved when done.
     */
    SQLiteDBMock.prototype.close = function () {
        // WebSQL databases aren't closed.
        return Promise.resolve();
    };
    /**
     * Drop all the data in the database.
     *
     * @return Promise resolved when done.
     */
    SQLiteDBMock.prototype.emptyDatabase = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (tx) {
                // Query all tables from sqlite_master that we have created and can modify.
                var args = [], query = "SELECT * FROM sqlite_master\n                            WHERE name NOT LIKE 'sqlite\\_%' escape '\\' AND name NOT LIKE '\\_%' escape '\\'";
                tx.executeSql(query, args, function (tx, result) {
                    if (result.rows.length <= 0) {
                        // No tables to delete, stop.
                        resolve();
                        return;
                    }
                    // Drop all the tables.
                    var promises = [];
                    var _loop_1 = function (i) {
                        promises.push(new Promise(function (resolve, reject) {
                            // Drop the table.
                            var name = JSON.stringify(result.rows.item(i).name);
                            tx.executeSql('DROP TABLE ' + name, [], resolve, reject);
                        }));
                    };
                    for (var i = 0; i < result.rows.length; i++) {
                        _loop_1(i);
                    }
                    Promise.all(promises).then(resolve, reject);
                }, reject);
            });
        });
    };
    /**
     * Execute a SQL query.
     * IMPORTANT: Use this function only if you cannot use any of the other functions in this API. Please take into account that
     * these query will be run in SQLite (Mobile) and Web SQL (desktop), so your query should work in both environments.
     *
     * @param sql SQL query to execute.
     * @param params Query parameters.
     * @return Promise resolved with the result.
     */
    SQLiteDBMock.prototype.execute = function (sql, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // With WebSQL, all queries must be run in a transaction.
            _this.db.transaction(function (tx) {
                tx.executeSql(sql, params, function (tx, results) {
                    resolve(results);
                }, function (tx, error) {
                    console.error(sql, params, error);
                    reject(error);
                });
            });
        });
    };
    /**
     * Execute a set of SQL queries. This operation is atomic.
     * IMPORTANT: Use this function only if you cannot use any of the other functions in this API. Please take into account that
     * these query will be run in SQLite (Mobile) and Web SQL (desktop), so your query should work in both environments.
     *
     * @param sqlStatements SQL statements to execute.
     * @return Promise resolved with the result.
     */
    SQLiteDBMock.prototype.executeBatch = function (sqlStatements) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Create a transaction to execute the queries.
            _this.db.transaction(function (tx) {
                var promises = [];
                // Execute all the queries. Each statement can be a string or an array.
                sqlStatements.forEach(function (statement) {
                    promises.push(new Promise(function (resolve, reject) {
                        var query, params;
                        if (Array.isArray(statement)) {
                            query = statement[0];
                            params = statement[1];
                        }
                        else {
                            query = statement;
                            params = null;
                        }
                        tx.executeSql(query, params, function (tx, results) {
                            resolve(results);
                        }, function (tx, error) {
                            console.error(query, params, error);
                            reject(error);
                        });
                    }));
                });
                Promise.all(promises).then(resolve, reject);
            });
        });
    };
    /**
     * Initialize the database.
     */
    SQLiteDBMock.prototype.init = function () {
        // This DB is for desktop apps, so use a big size to be sure it isn't filled.
        this.db = window.openDatabase(this.name, '1.0', this.name, 500 * 1024 * 1024);
        this.promise = Promise.resolve();
    };
    /**
     * Open the database. Only needed if it was closed before, a database is automatically opened when created.
     *
     * @return Promise resolved when done.
     */
    SQLiteDBMock.prototype.open = function () {
        // WebSQL databases can't closed, so the open method isn't needed.
        return Promise.resolve();
    };
    return SQLiteDBMock;
}(SQLiteDB));
export { SQLiteDBMock };
//# sourceMappingURL=sqlitedb.js.map