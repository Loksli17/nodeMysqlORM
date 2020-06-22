const mysql      = require('../../lib/database/mysql');
const DateModule = require('../../lib/date');

function modelMysql(_tableName){
    this.tableName = _tableName;
};


modelMysql.prototype.escape = function(object){
    if (typeof object == 'string'){
        let str = '';
        //экранирование строки на нежелательные символы
        for(let i = 0; i < object.length; i++){
            if(
                object[i] != '"' &&
                object[i] != "'" &&
                object[i] != "\x00" &&
                object[i] != "\n" &&
                object[i] != "\r" &&
                object[i] != "\x1a" &&
                object[i] != "-"
            ){
                str += object[i];
            }
        }
        return str;
    }
    return object;
}


//@return EXEPTION if data in rules are uncorrect
modelMysql.prototype.checkTypeRules = function(){
    for(let keyStr in this.rules.string){
        for(let keyInt in this.rules.integer){
            if(this.rules.string[keyStr] == this.rules.integer[keyInt]){
                throw "Field `" + this.rules.string[keyStr] + "` is used in integer and string. Please, correct rules of your model.";
                return;
            }
        }
    }
}


//@return TRUE or FALSE of validation
modelMysql.prototype.validate = async function(object){
    if(this.rules != undefined){

        let
            errors = {
                required: [],
                string  : [],
                integer : [],
                json    : [],
                max     : [],
                min     : [],
                boolean : [],
                unique  : [],
                date    : [],
            },
            errorsFields = {},
            countObject  = 0;

        //countObject
        for(let key in object){
            countObject++;
        }

        let flag = 0;

        if(this.rules.required != undefined){
            let required = this.rules.required;
            for(let i in required){
                flag = 0;
                for(let key in object){
                    if(required[i] == key && object[key] != undefined && object[key] != ''){
                        break;
                    }else{
                        flag++;
                    }
                }
                if(flag == countObject){
                    errors.required.push(key);
                }
            }
        }

        if(this.rules.string != undefined){
            let str = this.rules.string;
            for(let i in str){
                for(let key in object){
                    if(str[i] == key && typeof object[key] != 'string'){
                        errors.string.push(key);
                    }
                }
            }
        }

        if(this.rules.integer != undefined){
            let int = this.rules.integer;
            for(let i in int){
                for(let key in object){
                    if(int[i] == key && typeof object[key] != 'number'){
                        if(isNaN(Number(object[key]))){
                            errors.integer.push(key);
                        }
                    }
                }
            }
        }

        if(this.rules.json != undefined){
            let json = this.rules.json;
            for(let i in json){
                for(let key in object){
                    if(json[i] == key && typeof object[key] != 'object'){
                        errors.json.push(json[i]);
                    }
                }
            }
        }

        if(this.rules.boolean != undefined){
            let boolean = this.rules.boolean;
            for(let i in boolean){
                for(let key in object){
                    if(key == boolean[i]){
                        if(typeof object[key] != "boolean"){
                            if((typeof object[key] == 'number' && object[key]!= 0 && object[key]!= 1) || typeof object[key] != 'number'){
                                errors.boolean.push(key)
                            }
                        }
                    }
                }
            }
        }

        if(this.rules.max != undefined){
            for(let i = 0; i < this.rules.max.length; i++){
                for(let key in object){
                    let opt = Object.keys(this.rules.max[i])[0];
                    if(key == opt){
                        switch(typeof object[key]){
                            case 'number':
                                if(object[key] > this.rules.max[i][opt]){
                                    errors.max.push(opt);
                                }
                                break;
                            case 'string':
                                if(object[key].length > this.rules.max[i][opt]){
                                    errors.max.push(opt);
                                }
                                break;
                            default:
                                throw "Field `" + Object.keys(this.rules.max[i])[0] + "` in max must have integer or string type. Please, correct rules of your model.";
                                return;
                        }
                    }
                }
            }
        }

        if(this.rules.min != undefined){
            for(let i = 0; i < this.rules.min.length; i++){
                for(let key in object){
                    let opt = Object.keys(this.rules.min[i])[0];
                    if(key == opt){
                        switch(typeof object[key]){
                            case 'number':
                                if(object[key] < this.rules.min[i][opt]){
                                    errors.min.push(opt);
                                }
                                break;
                            case 'string':
                                if(object[key].length < this.rules.min[i][opt]){
                                    errors.min.push(opt);
                                }
                                break;
                            default:
                                throw "Field `" + Object.keys(this.rules.min[i])[0] + "` in max must have integer or string type. Please, correct rules of your model.";
                                return;
                        }
                    }
                }
            }
        }

        if(this.rules.unique != undefined){
            let
                condition = "",
                query     = "",
                fields    = "",
                result    = [];

            for(let i = 0; i < this.rules.unique.length; i++){
                condition += this.rules.unique[i] + " = '" + object[this.rules.unique[i]] + "'";
                fields += this.rules.unique[i];
                if(i != this.rules.unique.length - 1){
                    condition += " OR ";
                    fields += ", ";
                }
            }

            query += 'SELECT ' +  fields + ' FROM ' + this.tableName + ' WHERE ' + condition;

            result = await mysql.promise().query(query);
            result = result[0][0];

            if(result != undefined){
                for(let keyRes in result){
                    for(let keyObj in object)
                    if(result[keyRes] == object[keyObj]){
                        errors.unique.push(keyObj);
                    }
                }
            }
        }

        if(this.rules.date != undefined){
            for(let i = 0; i < this.rules.date.length; i++){
                for(let key in object){
                    if(key == this.rules.date[i]){
                        if(Object.prototype.toString.call(object[key]) != '[object Date]' || isNaN(object[key].getTime())){
                            errors.date.push(key);
                        }else{
                            object[key] = DateModule.formatDbDate(object[key]);
                        }
                    }
                }
            }
        }

        if(this.rules.time != undefined){
            for(let i = 0; i < this.rules.date.length; i++){
                for(let key in object){
                    if(key == this.rules.date[i]){
                        if(Object.prototype.toString.call(object[key]) != '[object Date]' || isNaN(object[key].getTime())){
                            errors.date.push(key);
                        }else{
                            object[key] = DateModule.formatDbTime(object[key]);
                        }
                    }
                }
            }
        }

        if(this.rules.datetime != undefined){
            for(let i = 0; i < this.rules.date.length; i++){
                for(let key in object){
                    if(key == this.rules.date[i]){
                        if(Object.prototype.toString.call(object[key]) != '[object Date]' || isNaN(object[key].getTime())){
                            errors.date.push(key);
                        }else{
                            object[key] = DateModule.formatDbDateTime(object[key]);
                        }
                    }
                }
            }
        }


        //comment about adding of errors
        for(let key in object){
            for(let i = 0; i < errors.string.length; i++){
                if(key == errors.string[i]){
                    if(this.rulesMesseges.string != undefined){
                        errorsFields[key] = this.rulesMesseges.string;
                    }else{
                        errorsFields[key] = 'This field must be String';
                    }
                }
            }

            for(let i = 0; i < errors.integer.length; i++){
                if(key == errors.integer[i]){
                    if(this.rulesMesseges.integer != undefined){
                        errorsFields[key] = this.rulesMesseges.integer;
                    }else{
                        errorsFields[key] = 'This field must be Integer';
                    }
                }
            }

            for(let i = 0; i < errors.json.length; i++){
                if(key == errors.json[i]){
                    if(this.rulesMesseges.json != undefined){
                        errorsFields[key] = this.rulesMesseges.json;
                    }else{
                        errorsFields[key] = 'This field must be JSON';
                    }
                }
            }

            for(let i = 0; i < errors.max.length; i++){
                if(key == errors.max[i]){
                    if(this.rulesMesseges.max != undefined){
                        errorsFields[key] = this.rulesMesseges.max;
                    }else{
                        errorsFields[key] = 'This field has value more then value in rules.max';
                    }
                }
            }

            for(let i = 0; i < errors.min.length; i++){
                if(key == errors.min[i]){
                    if(this.rulesMesseges.min != undefined){
                        errorsFields[key] = this.rulesMesseges.min;
                    }else{
                        errorsFields[key] = 'This field has value less then value in rules.max';
                    }
                }
            }

            for(let i = 0; i < errors.boolean.length; i++){
                if(key == errors.boolean[i]){
                    if(this.rulesMesseges.boolean != undefined){
                        errorsFields[key] = this.rulesMesseges.boolean;
                    }else{
                        errorsFields[key] = 'This field must be boolean or has number value from [0, 1]';
                    }
                }
            }

            for(let i = 0; i < errors.unique.length; i++){
                if(key == errors.unique[i]){
                    if(this.rulesMesseges.unique != undefined){
                        errorsFields[key] = this.rulesMesseges.unique;
                    }else{
                        errorsFields[key] = "This field has unique value. Don't repeat value on this field";
                    }
                }
            }

            for(let i = 0; i < errors.date.length; i++){
                if(key == errors.date[i]){
                    if(this.rulesMesseges.date != undefined){
                        errorsFields[key] = this.rulesMesseges.date;
                    }else{
                        errorsFields[key] = "This field must be date. Please input correct date";
                    }
                }
            }
        }

        //check required
        if(this.rules.required != undefined){
            for(let i = 0; i < this.rules.required.length; i++){
                for(let j = 0; j < errors.required.length; j++){
                    if(this.rules.required[i] == errors.required[j]){
                        if(this.rulesMesseges.required != undefined){
                            errorsFields[this.rules.required[i]] = this.rulesMesseges.required;
                        }else{
                            errorsFields[this.rules.required[i]] = 'This field must be blanked';
                        }
                    }
                }
            }
        }

        for(let key in errors){
            if(errors[key].length != 0){
                return errorsFields;
            }
        }
        return true;
    }else{
        return true;
    }
}


modelMysql.prototype.find = async function(method, conditions){

    let query           = "",
        conditionsQuery = "",
        fields          = new Array();

    if(conditions == undefined){
        conditions = {};
    }

    if(conditions.select != undefined){
        if(!Array.isArray(conditions.select)){
            throw "Error: select must be an array";
            return;
        }
        for(let i = 0; i < conditions.select.length; i++){
            fields += conditions.select[i];
            if(i != conditions.select.length - 1){
                fields += ', ';
            }
        }
    }else{
        fields = '*';
    }

    //conditions concats to query
    if(conditions.join != undefined){
        if(!Array.isArray(conditions.join)){
            throw 'Error: join must be an array of array';
        }
        for(let i = 0; i < conditions.join.length; i++){
            conditions.join[i][0] = this.escape(conditions.join[i][0]);
            conditions.join[i][1] = this.escape(conditions.join[i][1]);
            conditions.join[i][2] = this.escape(conditions.join[i][2]);
            conditionsQuery += ' ' + conditions.join[i][0] + ' JOIN ' + '`' + conditions.join[i][1] + '`' + ' ON ' + conditions.join[i][2];
        }
    }

    if(conditions.where != undefined){
        conditionsQuery += ' WHERE ';
        for(let i = 0; i < conditions.where.length; i++){
            for(let j = 0; j < 2; j++){
                conditions.where[i][j] = this.escape(conditions.where[i][j]);
            }
            //open bracket
            if(conditions.where[i][3] == '('){
                conditionsQuery += '(';
            }

            conditionsQuery += conditions.where[i][0];
            conditionsQuery += conditions.where[i][1] == null ? 'NULL' :  " '" + conditions.where[i][1] + "' ";
            conditionsQuery += " " + conditions.where[i][2] + " ";

            //close bracket
            if(conditions.where[i][3] == ')'){
                conditionsQuery += ')';
            }
        }
    }

    if(conditions.whereIn != undefined){
        for(let i = 0; i < conditions.whereIn.length; i++){
            conditions.whereIn[i] = this.escape(conditions.whereIn[i]);
        }

        if(conditions.where == undefined){
            conditionsQuery += ' WHERE ';
        }else{
            conditionsQuery += conditions.whereIn[3] + ' ';
        }

        if(!conditions.whereIn[2].length){
            conditions.whereIn[2] = "''";
        }

        conditions.whereIn[1] = conditions.whereIn[1] ? '' : ' not';
        conditionsQuery += conditions.whereIn[0] + ' ' + conditions.whereIn[1] + ' IN ' + "(" + conditions.whereIn[2] + ") ";
    }

    if(conditions.whereBetween != undefined){
        for(let i = 0; i < conditions.whereBetween.length; i++){
            conditions.whereBetween[i] = this.escape(conditions.whereBetween[i]);
        }

        if(conditions.where == undefined && conditions.whereIn == undefined){
            conditionsQuery += ' WHERE ';
        }else{
            conditionsQuery += conditions.whereBetween[4] + ' ';
        }

        conditions.whereBetween[1] = conditions.whereBetween[1] ? '' : ' not';

        conditionsQuery += conditions.whereBetween[0] + ' ' + conditions.whereBetween[1] + ' BETWEEN ' + conditions.whereBetween[2] + ' AND ' + conditions.whereBetween[3];
    }

    if(conditions.like != undefined){
        let column,
            data,
            bracket,
            countParams = 3,
            like = "";

        if(conditions.where != undefined){
            like += ' AND ';
        }else{
            like += ' WHERE ';
        }

        for(let i = 0; i < conditions.like.length; i++){
            for(let j = 0; j < countParams; j++){
                if(conditions.like[i][j] == undefined){
                    throw 'parametr ' + j + ' is undefined. You should add this parametr';
                }
            }

            //defence from injections
            conditions.like[i][0] = this.escape(conditions.like[i][0]);
            conditions.like[i][1] = this.escape(conditions.like[i][1]);
            conditions.like[i][2] = this.escape(conditions.like[i][2]);

            if(conditions.like[i][3] == '('){
                like += conditions.like[i][3] + " ";
            }
            like += conditions.like[i][0] + " LIKE '" + conditions.like[i][1] + "' ";
            if(conditions.like[i][3] == ')'){
                like += conditions.like[i][3] + " ";
            }
            if(i != conditions.like.length - 1){
                like += conditions.like[i][2] + " ";
            }
        }
        conditionsQuery += like;
    }

    if(conditions.group != undefined){
        conditions.group = this.escape(conditions.group);
        conditionsQuery += ' GROUP BY ' + conditions.group;
        if(conditions.groupDesc != undefined){
            conditionsQuery += ' DESC';
        }
    }

    if(conditions.having != undefined){
        conditions.having = this.escape(conditions.having);
        conditionsQuery += ' HAVING ' + conditions.having;
    }

    if(conditions.order != undefined){
        conditions.order = this.escape(conditions.order);
        conditionsQuery += ' ORDER BY ' + conditions.order;
        if(conditions.orderDesc != undefined && conditions.orderDesc){
            conditionsQuery += ' DESC';
        }
    }

    if(conditions.limit != undefined){
        if(method != 'one'){
            conditions.limit = this.escape(conditions.limit);
            conditionsQuery += ' LIMIT ' + conditions.limit;
        }
    }

    if(conditions.union != undefined){
        conditions.union = this.escape(conditions.union);
        conditionsQuery += ' UNION ' + conditions.union;
    }

    switch(method){
        case 'all':
            query = 'SELECT ' + fields + ' from ' + this.tableName + conditionsQuery + ';';
            break;
        case 'one':
            query = 'SELECT ' + fields + ' from ' + this.tableName + conditionsQuery + ' LIMIT 1;';
            break;
        case 'count':
            query = 'SELECT COUNT(*) from ' + this.tableName + ' ' + conditionsQuery + ' HAVING COUNT(*) limit 1;';
            break;
        default:
            throw "Error: method must be 'all' or 'one' or 'count'";
            return;
    }

    if(conditions.sql != undefined && conditions.sql){
        return query;
    }

    var result = await mysql.promise().query(query);

    switch(method){
        case 'all':
            result = result[0];
            break;
        case 'one':
            result = result[0][0];
            break;
        case 'count':
            if(result[0][0] != undefined){
                result = result[0][0]['COUNT(*)'];
            }else{
                result = 0;
            }
            break;
    }

    return result;
}


//@return OBJECT
modelMysql.prototype.findById = async function(id){
    if(id == undefined){
        throw 'Error: param id was undefined';
        return false;
    }
    id = Number(id);
    if(isNaN(id)){
        throw 'Error: param id must be a number';
        return false;
    }
    let query = 'SELECT * FROM ' + this.tableName + ' WHERE id = ?; ';
    var task = await mysql.promise().query(query, id);
    task = task[0][0];
    return task;
}


//@return TRUE if deleting was success or FALSE else
modelMysql.prototype.remove = async function(conditions){
    let where = '',
        query = '';

    if(conditions == undefined){
        conditions = {};
    }

    if(conditions.where != undefined){
        where += ' WHERE ';
        for(let i = 0; i < conditions.where.length; i++){
            for(let j = 0; j < 2; j++){
                conditions.where[i][j] = this.escape(conditions.where[i][j]);
            }
            //open bracket
            if(conditions.where[i][3] == '('){
                where += '(';
            }

            where += conditions.where[i][0];
            where += conditions.where[i][1] == null ? 'NULL' :  " '" + conditions.where[i][1] + "' ";
            where += " " + conditions.where[i][2] + " ";

            //close bracket
            if(conditions.where[i][3] == ')'){
                conditionsQuery += ')';
            }
        }
    }

    query = 'DELETE FROM ' + this.tableName + where + ';';

    if(conditions.sql != undefined && conditions.sql){
        return query;
    }

    let result = await mysql.promise().query(query);
    return (!result[0].warningStatus) ? true : false;
}


//@return TRUE if deleting was success or FALSE else
modelMysql.prototype.removeById = async function(id){
    if(id == undefined){
        throw 'Error: param id was undefined';
        return false;
    }
    id = Number(id);
    if(isNaN(id)){
        throw 'Error: param id must be a number';
        return false;
    }
    //deleting
    let query = 'DELETE FROM ' + this.tableName + ' WHERE id = ?;';
    let result = await mysql.promise().query(query, [id]);
    return (!result[0].warningStatus) ? true : false;
}


//@return object of mysql - mysqlQuery
modelMysql.prototype.query = async function(query){
    let result = await mysql.promise().query(query);
    return result;
}


//@return true or false of updating
modelMysql.prototype.save = async function(object, id, sql){

    this.checkTypeRules();

    let query         = "",
        result        = "",
        keyValidation = "",
        validation    = await this.validate(object); //получит либо true либо ошибки валидации

    if(validation != true){
        for(let key in validation){
            if(key != undefined){
                keyValidation = key;
                break;
            }
        }

        if(this.validateMessege){
            for(let key in this.fields){
                if(keyValidation == key){
                    return this.validateMessege + '. ' + this.fields[keyValidation] + ': ' + validation[keyValidation];
                }
            }
            return 'Model wasn`t validated, Error: ' + this.fields[keyValidation] + ' in ' + validation[keyValidation];
        }
        return 'Model wasn`t validated, Error: ' + this.fields[keyValidation] + ' in ' + validation[keyValidation];
    }

    for(let key in object){
        if(typeof object[key] == "object" && object[key] != null){
            object[key] = JSON.stringify(object[key]);
        }
    }

    if(id == undefined){
        //insert
        query = 'INSERT ' + this.tableName + ' SET ?;';
        result = await mysql.promise().query(query, [object]);
    }else{
        //update
        id = Number(id);
        if(isNaN(id)){
            throw 'Error: param id must be a number';
            return false;
        }
        query = 'UPDATE ' + this.tableName + ' SET ? WHERE id = ?;';
        result = await mysql.promise().query(query, [object, id]);
    }

    return (!result[0].warningStatus) ? true : 'error ';
}


module.exports = modelMysql;
