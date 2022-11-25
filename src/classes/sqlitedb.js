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
/**
 * Class to interact with the local database.
 *
 * @description
 * This class allows creating and interacting with a SQLite database.
 *
 * You need to supply some dependencies when creating the instance:
 * this.db = new SQLiteDB('MyDB', sqlite, platform);
 */
var SQLiteDB = /** @class */ (function () {
    /**
     * Create and open the database.
     *
     * @param name Database name.
     * @param sqlite SQLite library.
     * @param platform Ionic platform.
     */
    function SQLiteDB(name, sqlite, platform) {
        this.name = name;
        this.sqlite = sqlite;
        this.platform = platform;
        this.init();
    }
    /**
     * Helper function to create a table if it doesn't exist.
     *
     * @param name The table name.
     * @param columns The columns to create in the table.
     * @param primaryKeys Names of columns that are primary key. Use it for compound primary keys.
     * @param uniqueKeys List of sets of unique columns. E.g: [['section', 'title'], ['author', 'title']].
     * @param foreignKeys List of foreign keys.
     * @param tableCheck Check constraint for the table.
     * @return SQL query.
     */
    SQLiteDB.prototype.buildCreateTableSql = function (name, columns, primaryKeys, uniqueKeys, foreignKeys, tableCheck) {
        var columnsSql = [];
        var sql = "CREATE TABLE IF NOT EXISTS " + name + " (";
        // First define all the columns.
        for (var index in columns) {
            var column = columns[index];
            var columnSql = column.name || '';
            if (column.type) {
                columnSql += ' ' + column.type;
            }
            if (column.primaryKey) {
                columnSql += ' PRIMARY KEY';
                if (column.autoIncrement) {
                    columnSql += ' AUTOINCREMENT';
                }
            }
            if (column.notNull) {
                columnSql += ' NOT NULL';
            }
            if (column.unique) {
                columnSql += ' UNIQUE';
            }
            if (column.check) {
                columnSql += " CHECK (" + column.check + ")";
            }
            if (typeof column.default != 'undefined') {
                columnSql += " DEFAULT " + column.default;
            }
            columnsSql.push(columnSql);
        }
        sql += columnsSql.join(', ');
        // Now add the table constraints.
        if (primaryKeys && primaryKeys.length) {
            sql += ", PRIMARY KEY (" + primaryKeys.join(', ') + ")";
        }
        if (uniqueKeys && uniqueKeys.length) {
            for (var index in uniqueKeys) {
                var setOfKeys = uniqueKeys[index];
                if (setOfKeys && setOfKeys.length) {
                    sql += ", UNIQUE (" + setOfKeys.join(', ') + ")";
                }
            }
        }
        if (tableCheck) {
            sql += ", CHECK (" + tableCheck + ")";
        }
        for (var index in foreignKeys) {
            var foreignKey = foreignKeys[index];
            if (!foreignKey.columns || !!foreignKey.columns.length) {
                return;
            }
            sql += ", FOREIGN KEY (" + foreignKey.columns.join(', ') + ") REFERENCES " + foreignKey.table + " ";
            if (foreignKey.foreignColumns && foreignKey.foreignColumns.length) {
                sql += "(" + foreignKey.foreignColumns.join(', ') + ")";
            }
            if (foreignKey.actions) {
                sql += " " + foreignKey.actions;
            }
        }
        return sql + ')';
    };
    /**
     * Close the database.
     *
     * @return Promise resolved when done.
     */
    SQLiteDB.prototype.close = function () {
        var _this = this;
        return this.ready().then(function () {
            return _this.db.close();
        });
    };
    /**
     * Count the records in a table where all the given conditions met.
     *
     * @param table The table to query.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @return Promise resolved with the count of records returned from the specified criteria.
     */
    SQLiteDB.prototype.countRecords = function (table, conditions) {
        var selectAndParams = this.whereClause(conditions);
        return this.countRecordsSelect(table, selectAndParams[0], selectAndParams[1]);
    };
    /**
     * Count the records in a table which match a particular WHERE clause.
     *
     * @param table The table to query.
     * @param select A fragment of SQL to be used in a where clause in the SQL call.
     * @param params An array of sql parameters.
     * @param countItem The count string to be used in the SQL call. Default is COUNT('x').
     * @return Promise resolved with the count of records returned from the specified criteria.
     */
    SQLiteDB.prototype.countRecordsSelect = function (table, select, params, countItem) {
        if (select === void 0) { select = ''; }
        if (countItem === void 0) { countItem = 'COUNT(\'x\')'; }
        if (select) {
            select = 'WHERE ' + select;
        }
        return this.countRecordsSql("SELECT " + countItem + " FROM " + table + " " + select, params);
    };
    /**
     * Get the result of a SQL SELECT COUNT(...) query.
     *
     * Given a query that counts rows, return that count.
     *
     * @param sql The SQL string you wish to be executed.
     * @param params An array of sql parameters.
     * @return Promise resolved with the count.
     */
    SQLiteDB.prototype.countRecordsSql = function (sql, params) {
        return this.getFieldSql(sql, params).then(function (count) {
            if (typeof count != 'number' || count < 0) {
                return 0;
            }
            return count;
        });
    };
    /**
     * Create a table if it doesn't exist.
     *
     * @param name The table name.
     * @param columns The columns to create in the table.
     * @param primaryKeys Names of columns that are primary key. Use it for compound primary keys.
     * @param uniqueKeys List of sets of unique columns. E.g: [['section', 'title'], ['author', 'title']].
     * @param foreignKeys List of foreign keys.
     * @param tableCheck Check constraint for the table.
     * @return Promise resolved when success.
     */
    SQLiteDB.prototype.createTable = function (name, columns, primaryKeys, uniqueKeys, foreignKeys, tableCheck) {
        var sql = this.buildCreateTableSql(name, columns, primaryKeys, uniqueKeys, foreignKeys, tableCheck);
        return this.execute(sql);
    };
    /**
     * Create a table if it doesn't exist from a schema.
     *
     * @param table Table schema.
     * @return Promise resolved when success.
     */
    SQLiteDB.prototype.createTableFromSchema = function (table) {
        return this.createTable(table.name, table.columns, table.primaryKeys, table.uniqueKeys, table.foreignKeys, table.tableCheck);
    };
    /**
     * Create several tables if they don't exist from a list of schemas.
     *
     * @param tables List of table schema.
     * @return Promise resolved when success.
     */
    SQLiteDB.prototype.createTablesFromSchema = function (tables) {
        var _this = this;
        var promises = [];
        tables.forEach(function (table) {
            promises.push(_this.createTableFromSchema(table));
        });
        return Promise.all(promises);
    };
    /**
     * Delete the records from a table where all the given conditions met.
     * If conditions not specified, table is truncated.
     *
     * @param table The table to delete from.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @return Promise resolved when done.
     */
    SQLiteDB.prototype.deleteRecords = function (table, conditions) {
        if (conditions === null || typeof conditions == 'undefined') {
            // No conditions, delete the whole table.
            return this.execute("DELETE FROM " + table);
        }
        var selectAndParams = this.whereClause(conditions);
        return this.deleteRecordsSelect(table, selectAndParams[0], selectAndParams[1]);
    };
    /**
     * Delete the records from a table where one field match one list of values.
     *
     * @param table The table to delete from.
     * @param field The name of a field.
     * @param values The values field might take.
     * @return Promise resolved when done.
     */
    SQLiteDB.prototype.deleteRecordsList = function (table, field, values) {
        var selectAndParams = this.whereClauseList(field, values);
        return this.deleteRecordsSelect(table, selectAndParams[0], selectAndParams[1]);
    };
    /**
     * Delete one or more records from a table which match a particular WHERE clause.
     *
     * @param table The table to delete from.
     * @param select A fragment of SQL to be used in a where clause in the SQL call.
     * @param params Array of sql parameters.
     * @return Promise resolved when done.
     */
    SQLiteDB.prototype.deleteRecordsSelect = function (table, select, params) {
        if (select === void 0) { select = ''; }
        if (select) {
            select = 'WHERE ' + select;
        }
        return this.execute("DELETE FROM " + table + " " + select, params);
    };
    /**
     * Drop a table if it exists.
     *
     * @param name The table name.
     * @return Promise resolved when success.
     */
    SQLiteDB.prototype.dropTable = function (name) {
        return this.execute("DROP TABLE IF EXISTS " + name);
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
    SQLiteDB.prototype.execute = function (sql, params) {
        var _this = this;
        return this.ready().then(function () {
            return _this.db.executeSql(sql, params);
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
    SQLiteDB.prototype.executeBatch = function (sqlStatements) {
        var _this = this;
        return this.ready().then(function () {
            return _this.db.sqlBatch(sqlStatements);
        });
    };
    /**
     * Format the data to insert in the database. Removes undefined entries so they are stored as null instead of 'undefined'.
     *
     * @param data Data to insert.
     */
    SQLiteDB.prototype.formatDataToInsert = function (data) {
        if (!data) {
            return;
        }
        // Remove undefined entries and convert null to "NULL".
        for (var name_1 in data) {
            var value = data[name_1];
            if (typeof value == 'undefined') {
                delete data[name_1];
            }
        }
    };
    /**
     * Get all the records from a table.
     *
     * @param table The table to query.
     * @return Promise resolved with the records.
     */
    SQLiteDB.prototype.getAllRecords = function (table) {
        return this.getRecords(table);
    };
    /**
     * Get a single field value from a table record where all the given conditions met.
     *
     * @param table The table to query.
     * @param field The field to return the value of.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @return Promise resolved with the field's value.
     */
    SQLiteDB.prototype.getField = function (table, field, conditions) {
        var selectAndParams = this.whereClause(conditions);
        return this.getFieldSelect(table, field, selectAndParams[0], selectAndParams[1]);
    };
    /**
     * Get a single field value from a table record which match a particular WHERE clause.
     *
     * @param table The table to query.
     * @param field The field to return the value of.
     * @param select A fragment of SQL to be used in a where clause returning one row with one column.
     * @param params Array of sql parameters.
     * @return Promise resolved with the field's value.
     */
    SQLiteDB.prototype.getFieldSelect = function (table, field, select, params) {
        if (select === void 0) { select = ''; }
        if (select) {
            select = 'WHERE ' + select;
        }
        return this.getFieldSql("SELECT " + field + " FROM " + table + " " + select, params);
    };
    /**
     * Get a single field value (first field) using a SQL statement.
     *
     * @param sql The SQL query returning one row with one column.
     * @param params An array of sql parameters.
     * @return Promise resolved with the field's value.
     */
    SQLiteDB.prototype.getFieldSql = function (sql, params) {
        return this.getRecordSql(sql, params).then(function (record) {
            if (!record) {
                return Promise.reject(null);
            }
            // Return the first property.
            return record[Object.keys(record)[0]];
        });
    };
    /**
     * Constructs 'IN()' or '=' sql fragment
     *
     * @param items A single value or array of values for the expression. It doesn't accept objects.
     * @param equal True means we want to equate to the constructed expression.
     * @param onEmptyItems This defines the behavior when the array of items provided is empty. Defaults to false,
     *                     meaning return empty. Other values will become part of the returned SQL fragment.
     * @return A list containing the constructed sql fragment and an array of parameters.
     */
    SQLiteDB.prototype.getInOrEqual = function (items, equal, onEmptyItems) {
        if (equal === void 0) { equal = true; }
        var sql, params;
        if (typeof onEmptyItems == 'undefined') {
            onEmptyItems = false;
        }
        // Default behavior, return empty data on empty array.
        if (Array.isArray(items) && !items.length && onEmptyItems === false) {
            return ['', []];
        }
        // Handle onEmptyItems on empty array of items.
        if (Array.isArray(items) && !items.length) {
            if (onEmptyItems === null) {
                sql = equal ? ' IS NULL' : ' IS NOT NULL';
                return [sql, []];
            }
            else {
                items = [onEmptyItems]; // Rest of cases, prepare items for processing.
            }
        }
        if (!Array.isArray(items) || items.length == 1) {
            sql = equal ? '= ?' : '<> ?';
            params = Array.isArray(items) ? items : [items];
        }
        else {
            sql = (equal ? '' : 'NOT ') + 'IN (' + ',?'.repeat(items.length).substr(1) + ')';
            params = items;
        }
        return [sql, params];
    };
    /**
     * Get the database name.
     *
     * @return Database name.
     */
    SQLiteDB.prototype.getName = function () {
        return this.name;
    };
    /**
     * Get a single database record where all the given conditions met.
     *
     * @param table The table to query.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @param fields A comma separated list of fields to return.
     * @return Promise resolved with the record, rejected if not found.
     */
    SQLiteDB.prototype.getRecord = function (table, conditions, fields) {
        if (fields === void 0) { fields = '*'; }
        var selectAndParams = this.whereClause(conditions);
        return this.getRecordSelect(table, selectAndParams[0], selectAndParams[1], fields);
    };
    /**
     * Get a single database record as an object which match a particular WHERE clause.
     *
     * @param table The table to query.
     * @param select A fragment of SQL to be used in a where clause in the SQL call.
     * @param params An array of sql parameters.
     * @param fields A comma separated list of fields to return.
     * @return Promise resolved with the record, rejected if not found.
     */
    SQLiteDB.prototype.getRecordSelect = function (table, select, params, fields) {
        if (select === void 0) { select = ''; }
        if (params === void 0) { params = []; }
        if (fields === void 0) { fields = '*'; }
        if (select) {
            select = ' WHERE ' + select;
        }
        return this.getRecordSql("SELECT " + fields + " FROM " + table + " " + select, params);
    };
    /**
     * Get a single database record as an object using a SQL statement.
     *
     * The SQL statement should normally only return one record.
     * It is recommended to use getRecordsSql() if more matches possible!
     *
     * @param sql The SQL string you wish to be executed, should normally only return one record.
     * @param params List of sql parameters
     * @return Promise resolved with the records.
     */
    SQLiteDB.prototype.getRecordSql = function (sql, params) {
        return this.getRecordsSql(sql, params, 0, 1).then(function (result) {
            if (!result || !result.length) {
                // Not found, reject.
                return Promise.reject(null);
            }
            // Return only the first record.
            return result[0];
        });
    };
    /**
     * Get a number of records where all the given conditions met.
     *
     * @param table The table to query.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @param sort An order to sort the results in.
     * @param fields A comma separated list of fields to return.
     * @param limitFrom Return a subset of records, starting at this point.
     * @param limitNum Return a subset comprising this many records in total.
     * @return Promise resolved with the records.
     */
    SQLiteDB.prototype.getRecords = function (table, conditions, sort, fields, limitFrom, limitNum) {
        if (sort === void 0) { sort = ''; }
        if (fields === void 0) { fields = '*'; }
        if (limitFrom === void 0) { limitFrom = 0; }
        if (limitNum === void 0) { limitNum = 0; }
        var selectAndParams = this.whereClause(conditions);
        return this.getRecordsSelect(table, selectAndParams[0], selectAndParams[1], sort, fields, limitFrom, limitNum);
    };
    /**
     * Get a number of records where one field match one list of values.
     *
     * @param table The database table to be checked against.
     * @param field The name of a field.
     * @param values The values field might take.
     * @param sort An order to sort the results in.
     * @param fields A comma separated list of fields to return.
     * @param limitFrom Return a subset of records, starting at this point.
     * @param limitNum Return a subset comprising this many records in total.
     * @return Promise resolved with the records.
     */
    SQLiteDB.prototype.getRecordsList = function (table, field, values, sort, fields, limitFrom, limitNum) {
        if (sort === void 0) { sort = ''; }
        if (fields === void 0) { fields = '*'; }
        if (limitFrom === void 0) { limitFrom = 0; }
        if (limitNum === void 0) { limitNum = 0; }
        var selectAndParams = this.whereClauseList(field, values);
        return this.getRecordsSelect(table, selectAndParams[0], selectAndParams[1], sort, fields, limitFrom, limitNum);
    };
    /**
     * Get a number of records which match a particular WHERE clause.
     *
     * @param table The table to query.
     * @param select A fragment of SQL to be used in a where clause in the SQL call.
     * @param params An array of sql parameters.
     * @param sort An order to sort the results in.
     * @param fields A comma separated list of fields to return.
     * @param limitFrom Return a subset of records, starting at this point.
     * @param limitNum Return a subset comprising this many records in total.
     * @return Promise resolved with the records.
     */
    SQLiteDB.prototype.getRecordsSelect = function (table, select, params, sort, fields, limitFrom, limitNum) {
        if (select === void 0) { select = ''; }
        if (params === void 0) { params = []; }
        if (sort === void 0) { sort = ''; }
        if (fields === void 0) { fields = '*'; }
        if (limitFrom === void 0) { limitFrom = 0; }
        if (limitNum === void 0) { limitNum = 0; }
        if (select) {
            select = ' WHERE ' + select;
        }
        if (sort) {
            sort = ' ORDER BY ' + sort;
        }
        var sql = "SELECT " + fields + " FROM " + table + " " + select + " " + sort;
        return this.getRecordsSql(sql, params, limitFrom, limitNum);
    };
    /**
     * Get a number of records using a SQL statement.
     *
     * @param sql The SQL select query to execute.
     * @param params List of sql parameters
     * @param limitFrom Return a subset of records, starting at this point.
     * @param limitNum Return a subset comprising this many records.
     * @return Promise resolved with the records.
     */
    SQLiteDB.prototype.getRecordsSql = function (sql, params, limitFrom, limitNum) {
        var limits = this.normaliseLimitFromNum(limitFrom, limitNum);
        if (limits[0] || limits[1]) {
            if (limits[1] < 1) {
                limits[1] = Number.MAX_VALUE;
            }
            sql += ' LIMIT ' + limits[0] + ', ' + limits[1];
        }
        return this.execute(sql, params).then(function (result) {
            // Retrieve the records.
            var records = [];
            for (var i = 0; i < result.rows.length; i++) {
                records.push(result.rows.item(i));
            }
            return records;
        });
    };
    /**
     * Given a data object, returns the SQL query and the params to insert that record.
     *
     * @param table The database table.
     * @param data A data object with values for one or more fields in the record.
     * @return Array with the SQL query and the params.
     */
    SQLiteDB.prototype.getSqlInsertQuery = function (table, data) {
        this.formatDataToInsert(data);
        var keys = Object.keys(data), fields = keys.join(','), questionMarks = ',?'.repeat(keys.length).substr(1);
        return [
            "INSERT OR REPLACE INTO " + table + " (" + fields + ") VALUES (" + questionMarks + ")",
            keys.map(function (key) { return data[key]; })
        ];
    };
    /**
     * Initialize the database.
     */
    SQLiteDB.prototype.init = function () {
        var _this = this;
        this.promise = this.platform.ready().then(function () {
            return _this.sqlite.create({
                name: _this.name,
                location: 'default'
            });
        }).then(function (db) {
            _this.db = db;
        });
    };
    /**
     * Insert a record into a table and return the "rowId" field.
     *
     * @param table The database table to be inserted into.
     * @param data A data object with values for one or more fields in the record.
     * @return Promise resolved with new rowId. Please notice this rowId is internal from SQLite.
     */
    SQLiteDB.prototype.insertRecord = function (table, data) {
        var sqlAndParams = this.getSqlInsertQuery(table, data);
        return this.execute(sqlAndParams[0], sqlAndParams[1]).then(function (result) {
            return result.insertId;
        });
    };
    /**
     * Insert multiple records into database as fast as possible.
     *
     * @param table The database table to be inserted into.
     * @param dataObjects List of objects to be inserted.
     * @return Promise resolved when done.
     */
    SQLiteDB.prototype.insertRecords = function (table, dataObjects) {
        var _this = this;
        if (!Array.isArray(dataObjects)) {
            return Promise.reject(null);
        }
        var statements = [];
        dataObjects.forEach(function (dataObject) {
            statements.push(_this.getSqlInsertQuery(table, dataObject));
        });
        return this.executeBatch(statements);
    };
    /**
     * Insert multiple records into database from another table.
     *
     * @param table The database table to be inserted into.
     * @param source The database table to get the records from.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @param fields A comma separated list of fields to return.
     * @return Promise resolved when done.
     */
    SQLiteDB.prototype.insertRecordsFrom = function (table, source, conditions, fields) {
        if (fields === void 0) { fields = '*'; }
        var selectAndParams = this.whereClause(conditions);
        var select = selectAndParams[0] ? 'WHERE ' + selectAndParams[0] : '';
        var params = selectAndParams[1];
        return this.execute("INSERT INTO " + table + " SELECT " + fields + " FROM " + source + " " + select, params);
    };
    /**
     * Ensures that limit params are numeric and positive integers, to be passed to the database.
     * We explicitly treat null, '' and -1 as 0 in order to provide compatibility with how limit
     * values have been passed historically.
     *
     * @param limitFrom Where to start results from.
     * @param limitNum How many results to return.
     * @return Normalised limit params in array: [limitFrom, limitNum].
     */
    SQLiteDB.prototype.normaliseLimitFromNum = function (limitFrom, limitNum) {
        // We explicilty treat these cases as 0.
        if (typeof limitFrom == 'undefined' || limitFrom === null || limitFrom === '' || limitFrom === -1) {
            limitFrom = 0;
        }
        if (typeof limitNum == 'undefined' || limitNum === null || limitNum === '' || limitNum === -1) {
            limitNum = 0;
        }
        limitFrom = parseInt(limitFrom, 10);
        limitNum = parseInt(limitNum, 10);
        limitFrom = Math.max(0, limitFrom);
        limitNum = Math.max(0, limitNum);
        return [limitFrom, limitNum];
    };
    /**
     * Open the database. Only needed if it was closed before, a database is automatically opened when created.
     *
     * @return Promise resolved when open.
     */
    SQLiteDB.prototype.open = function () {
        var _this = this;
        return this.ready().then(function () {
            return _this.db.open();
        });
    };
    /**
     * Wait for the DB to be ready.
     *
     * @return Promise resolved when ready.
     */
    SQLiteDB.prototype.ready = function () {
        return this.promise;
    };
    /**
     * Test whether a record exists in a table where all the given conditions met.
     *
     * @param table The table to check.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @return Promise resolved if exists, rejected otherwise.
     */
    SQLiteDB.prototype.recordExists = function (table, conditions) {
        return this.getRecord(table, conditions).then(function (record) {
            if (!record) {
                return Promise.reject(null);
            }
        });
    };
    /**
     * Test whether any records exists in a table which match a particular WHERE clause.
     *
     * @param table The table to query.
     * @param select A fragment of SQL to be used in a where clause in the SQL call.
     * @param params An array of sql parameters.
     * @return Promise resolved if exists, rejected otherwise.
     */
    SQLiteDB.prototype.recordExistsSelect = function (table, select, params) {
        if (select === void 0) { select = ''; }
        if (params === void 0) { params = []; }
        return this.getRecordSelect(table, select, params).then(function (record) {
            if (!record) {
                return Promise.reject(null);
            }
        });
    };
    /**
     * Test whether a SQL SELECT statement returns any records.
     *
     * @param sql The SQL query returning one row with one column.
     * @param params An array of sql parameters.
     * @return Promise resolved if exists, rejected otherwise.
     */
    SQLiteDB.prototype.recordExistsSql = function (sql, params) {
        return this.getRecordSql(sql, params).then(function (record) {
            if (!record) {
                return Promise.reject(null);
            }
        });
    };
    /**
     * Test whether a table exists..
     *
     * @param name The table name.
     * @return Promise resolved if exists, rejected otherwise.
     */
    SQLiteDB.prototype.tableExists = function (name) {
        return this.recordExists('sqlite_master', { type: 'table', tbl_name: name });
    };
    /**
     * Update one or more records in a table.
     *
     * @param string table The database table to update.
     * @param data An object with the fields to update: fieldname=>fieldvalue.
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @return Promise resolved when updated.
     */
    SQLiteDB.prototype.updateRecords = function (table, data, conditions) {
        this.formatDataToInsert(data);
        if (!data || !Object.keys(data).length) {
            // No fields to update, consider it's done.
            return Promise.resolve();
        }
        var whereAndParams = this.whereClause(conditions), sets = [];
        var sql, params;
        for (var key in data) {
            sets.push(key + " = ?");
        }
        sql = "UPDATE " + table + " SET " + sets.join(', ') + " WHERE " + whereAndParams[0];
        // Create the list of params using the "data" object and the params for the where clause.
        params = Object.keys(data).map(function (key) { return data[key]; }).concat(whereAndParams[1]);
        return this.execute(sql, params);
    };
    /**
     * Update one or more records in a table. It accepts a WHERE clause as a string.
     *
     * @param string table The database table to update.
     * @param data An object with the fields to update: fieldname=>fieldvalue.
     * @param where Where clause. Must not include the "WHERE" word.
     * @param whereParams Params for the where clause.
     * @return Promise resolved when updated.
     */
    SQLiteDB.prototype.updateRecordsWhere = function (table, data, where, whereParams) {
        if (!data || !Object.keys(data).length) {
            // No fields to update, consider it's done.
            return Promise.resolve();
        }
        var sets = [];
        var sql, params;
        for (var key in data) {
            sets.push(key + " = ?");
        }
        sql = "UPDATE " + table + " SET " + sets.join(', ');
        if (where) {
            sql += " WHERE " + where;
        }
        // Create the list of params using the "data" object and the params for the where clause.
        params = Object.keys(data).map(function (key) { return data[key]; });
        if (where && whereParams) {
            params = params.concat(whereParams);
        }
        return this.execute(sql, params);
    };
    /**
     * Returns the SQL WHERE conditions.
     *
     * @param conditions The conditions to build the where clause. Must not contain numeric indexes.
     * @return An array list containing sql 'where' part and 'params'.
     */
    SQLiteDB.prototype.whereClause = function (conditions) {
        if (conditions === void 0) { conditions = {}; }
        if (!conditions || !Object.keys(conditions).length) {
            return ['1 = 1', []];
        }
        var where = [], params = [];
        for (var key in conditions) {
            var value = conditions[key];
            if (typeof value == 'undefined' || value === null) {
                where.push(key + ' IS NULL');
            }
            else {
                where.push(key + ' = ?');
                params.push(value);
            }
        }
        return [where.join(' AND '), params];
    };
    /**
     * Returns SQL WHERE conditions for the ..._list group of methods.
     *
     * @param field The name of a field.
     * @param values The values field might take.
     * @return An array containing sql 'where' part and 'params'.
     */
    SQLiteDB.prototype.whereClauseList = function (field, values) {
        if (!values || !values.length) {
            return ['1 = 2', []]; // Fake condition, won't return rows ever.
        }
        var params = [];
        var select = '';
        values.forEach(function (value) {
            if (typeof value == 'boolean') {
                value = Number(value);
            }
            if (typeof value == 'undefined' || value === null) {
                select = field + ' IS NULL';
            }
            else {
                params.push(value);
            }
        });
        if (params && params.length) {
            if (select !== '') {
                select = select + ' OR ';
            }
            if (params.length == 1) {
                select = select + field + ' = ?';
            }
            else {
                var questionMarks = ',?'.repeat(params.length).substr(1);
                select = select + field + ' IN (' + questionMarks + ')';
            }
        }
        return [select, params];
    };
    return SQLiteDB;
}());
export { SQLiteDB };
//# sourceMappingURL=sqlitedb.js.map