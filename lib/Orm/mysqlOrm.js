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
                object[i] != "\x1a"
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
    let
        permissionFields = ['integer', 'json', 'boolean', 'string', 'date', 'email', 'phone'],
        flFirst          = false,
        flSecond         = false,
        keyFirst         = '',
        keySecond        = '';

    for(let keyFirstRule in this.rules){
        flFirst = false;
        for(let i = 0; i < permissionFields.length; i++){
            if(permissionFields[i] == keyFirstRule) flFirst = true;
        }
        if(!flFirst) continue;

        for(let keySecondRule in this.rules){
            flSecond = false;
            for(let i = 0; i < permissionFields.length; i++){
                if(permissionFields[i] == keySecondRule && keySecondRule != keyFirstRule) flSecond = true;
            }
            if(!flSecond) continue;

            //проверка
            for(let keyRuleFirR in this.rules[keyFirstRule]){
                for(let keyRuleSecR in this.rules[keySecondRule]){
                    if(this.rules[keyFirstRule][keyRuleFirR] == this.rules[keySecondRule][keyRuleSecR]){
                        throw "Field `" + this.rules[keyFirstRule][keyRuleFirR] + "` is used in " + keyFirstRule + " and " + keySecondRule + ". Please, correct rules of your model.";
                        return;
                    }
                }
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
                datetime: [],
                time    : [],
                email   : [],
                phone   : [],
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
            for(let i = 0; i < required.length; i++){
                flag = 0;
                for(let key in object){
                    if(required[i] == key && object[key] != undefined && object[key] != ''){
                        break;
                    }else{
                        flag++;
                    }
                }
                if(flag == countObject){
                    errors.required.push(required[i]);
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

        if(this.rules.email != undefined){
            for(let i = 0; i < this.rules.email.length; i++){
                for(let key in object){
                    if(key == this.rules.email[i]){
                        object[key] = String(object[key]);
                        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                        if(!reg.test(String(object[key]).toLowerCase())){
                            errors.email.push(key);
                        }
                    }
                }
            }
        }

        if(this.rules.phone != undefined){
            for(let i = 0; i < this.rules.phone.length; i++){
                for(let key in object){
                    if(key == this.rules.phone[i]){
                        object[key] = object[key].replace('+7', 8);
                        if(isNaN(Number(object[key])) || object[key].length != 11){
                            errors.phone.push(key);
                        }else{
                            let regFormat = /(?:([\d]{1,}?))??(?:([\d]{1,3}?))??(?:([\d]{1,3}?))??(?:([\d]{2}))??([\d]{2})$/;
                            object[key] = object[key].replace(regFormat, function(all, a, b, c, d, e){
                                return (a ? a + " (" : "(" ) + ( b ? b + ") " : ")" ) + ( c ? c + "-" : "" ) + ( d ? d + "-" : "") + e;
                            });
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
                        errorsFields[key] = 'This field must be String.';
                    }
                }
            }

            for(let i = 0; i < errors.integer.length; i++){
                if(key == errors.integer[i]){
                    if(this.rulesMesseges.integer != undefined){
                        errorsFields[key] = this.rulesMesseges.integer;
                    }else{
                        errorsFields[key] = 'This field must be Integer.';
                    }
                }
            }

            for(let i = 0; i < errors.json.length; i++){
                if(key == errors.json[i]){
                    if(this.rulesMesseges.json != undefined){
                        errorsFields[key] = this.rulesMesseges.json;
                    }else{
                        errorsFields[key] = 'This field must be JSON.';
                    }
                }
            }

            for(let i = 0; i < errors.max.length; i++){
                if(key == errors.max[i]){
                    if(this.rulesMesseges.max != undefined){
                        errorsFields[key] = this.rulesMesseges.max;
                    }else{
                        errorsFields[key] = 'This field has value more then value in rules.max.';
                    }
                }
            }

            for(let i = 0; i < errors.min.length; i++){
                if(key == errors.min[i]){
                    if(this.rulesMesseges.min != undefined){
                        errorsFields[key] = this.rulesMesseges.min;
                    }else{
                        errorsFields[key] = 'This field has value less then value in rules.max.';
                    }
                }
            }

            for(let i = 0; i < errors.boolean.length; i++){
                if(key == errors.boolean[i]){
                    if(this.rulesMesseges.boolean != undefined){
                        errorsFields[key] = this.rulesMesseges.boolean;
                    }else{
                        errorsFields[key] = 'This field must be boolean or has number value from [0, 1].';
                    }
                }
            }

            for(let i = 0; i < errors.unique.length; i++){
                if(key == errors.unique[i]){
                    if(this.rulesMesseges.unique != undefined){
                        errorsFields[key] = this.rulesMesseges.unique;
                    }else{
                        errorsFields[key] = "This field has unique value. Don't repeat value on this field.";
                    }
                }
            }

            for(let i = 0; i < errors.date.length; i++){
                if(key == errors.date[i]){
                    if(this.rulesMesseges.date != undefined){
                        errorsFields[key] = this.rulesMesseges.date;
                    }else{
                        errorsFields[key] = "This field must be date. Please, input correct date.";
                    }
                }
            }

            for(let i = 0; i < errors.datetime.length; i++){
                if(key == errors.datetime[i]){
                    if(this.rulesMesseges.datetime != undefined){
                        errorsFields[key] = this.rulesMesseges.datetime;
                    }else{
                        errorsFields[key] = "This field must be datetime. Please, input correct datetime";
                    }
                }
            }

            for(let i = 0; i < errors.time.length; i++){
                if(key == errors.time[i]){
                    if(this.rulesMesseges.time != undefined){
                        errorsFields[key] = this.rulesMesseges.time;
                    }else{
                        errorsFields[key] = "This field must be time. Please, input correct time.";
                    }
                }
            }

            for(let i = 0; i < errors.email.length; i++){
                if(key == errors.email[i]){
                    if(this.rulesMesseges.email != undefined){
                        errorsFields[key] = this.rulesMesseges.email;
                    }else{
                        errorsFields[key] = "Please, input correct email.";
                    }
                }
            }

            for(let i = 0; i < errors.phone.length; i++){
                if(key == errors.phone[i]){
                    if(this.rulesMesseges.phone != undefined){
                        errorsFields[key] = this.rulesMesseges.phone;
                    }else{
                        errorsFields[key] = "Please, input correct phone.";
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


modelMysql.prototype.where = (where) => {
    let
        cond  = '',
        mesEr = 'Where must be an array of objects. Please use correct value of Where.',
        equal = (arr, ind, ort, condKey) => {
            if(typeof arr[ind] != 'object' || !arr instanceof Object){throw 'eq must be object of object'};
            for(let i in arr[ind]){
                if(typeof arr[ind][i] != 'object' || !arr[ind][i] instanceof Object){throw 'eq must be object of object'};
                for(let j in arr[ind][i]){
                    if(typeof arr[ind][i][j] == 'string') arr[ind][i][j] = this.escape(arr[ind][i][j]);
                    cond += ` ${j} ${ort} '${arr[ind][i][j]}' `;
                }
                if(condKey != undefined && ind != arr.length - 1){
                    cond += `${condKey}`;
                }
            }
        },
        like = (arr, ind, ort, condKey) => {
            if(typeof arr[ind] != 'object' || !arr instanceof Object){throw 'like must be object of object'};
            for(let i in arr[ind]){
                if(typeof arr[ind][i] != 'object' || !arr[ind][i] instanceof Object){throw 'like must be object of object'};
                for(let j in arr[ind][i]){
                    if(typeof arr[ind][i][j] == 'string') arr[ind][i][j] = this.escape(arr[ind][i][j]);
                    if(ort){
                        cond += ` ${j} LIKE '${arr[ind][i][j]}' `;
                    }else{
                        cond += ` ${j} not LIKE '${arr[ind][i][j]}' `;
                    }
                }
            }
            if(condKey != undefined && ind != arr.length - 1){
                cond += `${condKey}`;
            }
        },
        inFunc = (arr, ind, ort, condKey) => {
            if(typeof arr[ind] != 'object' || !arr instanceof Object){throw 'like must be array of object'};
            for(let i in arr[ind]){
                if(typeof arr[ind][i] != 'object' || !arr[ind][i] instanceof Array){throw 'like must be array of object'};
                for(let j in arr[ind][i]){
                    console.log()
                    if(typeof arr[ind][i][j] == 'string') arr[ind][i][j] = this.escape(arr[ind][i][j]);
                    if(ort){
                        cond += ` ${j} IN (`;
                    }else{
                        cond += ` ${j} not IN (`;
                    }
                    for(let k = 0; k < arr[ind][i][j].length; k++){
                        if(typeof arr[ind][i][j][k] == 'string') arr[ind][i][j][k] = this.escape(arr[ind][i][j][k]);
                        cond += `'${arr[ind][i][j][k]}'`;
                        if(arr[ind][i][j].length - 1 != k){
                            cond += ', ';
                        }
                    }
                    cond += `) `;
                }
            }
            if(condKey != undefined && ind != arr.length - 1){
                cond += `${condKey}`;
            }
        },
        between = (arr, ind, ort, condKey) => {
            if(typeof arr[ind] != 'object' || !arr instanceof Object){throw 'eq must be object of object'};
            for(let i in arr[ind]){
                for(let j in arr[ind][i]){
                    if(typeof arr[ind][i][j] == 'string') arr[ind][i][j] = this.escape(arr[ind][i][j]);
                    if(ort){
                        cond += ` ${j} BETWEEN '${arr[ind][i][j][0]}' AND '${arr[ind][i][j][1]}' `;
                    }else{
                        cond += ` ${j} not BETWEEN '${arr[ind][i][j][0]}' AND '${arr[ind][i][j][1]}' `;
                    }
                }
            }
        };


    if(!Array.isArray(where)) throw mesEr

    let treeIter = (arr, condKey) => {
        for(let i = 0; i < arr.length; i++){
            if(typeof arr[i] != 'object') throw mesEr

            let
                whereObj = arr[i],
                opts     = Object.keys(whereObj);

                switch(opts[0]){
                    case 'and':
                        cond += " (";
                        treeIter(arr[i]['and'], 'AND');
                        cond += ") ";
                        if(condKey != undefined && i != arr.length - 1){
                            cond += `${condKey}`;
                        }
                        break;
                    case 'or':
                        cond += " (";
                        treeIter(arr[i]['or'], 'OR');
                        cond += ") ";
                        if(condKey != undefined && i != arr.length - 1){
                            cond += `${condKey}`;
                        }
                        break;
                    case 'eq':
                        equal(arr, i, '=', condKey);
                        break;
                    case 'noteq':
                        equal(arr, i, '!=', condKey);
                        break;
                    case 'like':
                        like(arr, i, true, condKey);
                        break;
                    case 'notLike':
                        like(arr, i, false, condKey);
                        break;
                    case 'between':
                        between(arr, i, true, condKey);
                        break;
                    case 'notBetween':
                        between(arr, i, false, condKey);
                        break;
                    case 'more':
                        equal(arr, i, '>', condKey);
                        break;
                    case 'less':
                        equal(arr, i, '<', condKey);
                        break;
                    case 'in':
                        inFunc(arr, i, true, condKey);
                        break;
                    case 'notIn':
                        inFunc(arr, i, false, condKey);
                        break;
                }
        }
    }

    treeIter(where);
    return ` WHERE ${cond}`;
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
        conditionsQuery += this.where(conditions.where);
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
            query = 'SELECT ' + fields + ' from `' + this.tableName + '`' + conditionsQuery + ';';
            break;
        case 'one':
            query = 'SELECT ' + fields + ' from `' + this.tableName + '`' + conditionsQuery + ' LIMIT 1;';
            break;
        case 'count':
            query = 'SELECT COUNT(*) from `' + this.tableName + '` ' + conditionsQuery + ' HAVING COUNT(*) limit 1;';
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
    let query = 'SELECT * FROM `' + this.tableName + '` WHERE id = ?; ';
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
        where += this.where(conditions.where);
    }

    query = 'DELETE FROM `' + this.tableName + '`' + where + ';';

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
    let query = 'DELETE FROM `' + this.tableName + '` WHERE id = ?;';
    let result = await mysql.promise().query(query, [id]);
    return (!result[0].warningStatus) ? true : false;
}


//@return object of mysql - mysqlQuery
modelMysql.prototype.query = async function(query){
    let result = await mysql.promise().query(query);
    return result;
}


//@return true or false of updating
modelMysql.prototype.save = async function(_data){

    this.checkTypeRules();

    let
        object        = _data.obj,
        query         = "",
        result        = "",
        options       = "",
        optCount      = Object.keys(object).length,
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
            return 'Model wasn`t validated. Error in field: ' + keyValidation + ". " + validation[keyValidation];
        }
        return 'Model wasn`t validated. Error in field: ' + keyValidation + ". " + validation[keyValidation];
    }

    let i = 0;
    for(let key in object){
        i++;
        if(typeof object[key] == "object" && object[key] != null){
            object[key] = JSON.stringify(object[key]);
        }
        typeof object[key] == 'string' ? options += `${key} = '${object[key]}'` : options += `${key} = ${object[key]}`;
        if(i != optCount){
            options += `, `;
        }
    }

    if(_data.id == undefined){
        //insert
        query  = `INSERT \`${this.tableName}\` SET ${options};`;
        if(_data.sql) return query;
        result = await mysql.promise().query(query);
    }else{
        //update
        id = Number(mysql.escape(_data.id));
        if(isNaN(id)){
            console.log ('Error: param id must be a number');
            return false;
        }
        query  = `UPDATE ${this.tableName} SET ${options} WHERE id = ${id};`;
        if(_data.sql) return query;
        result = await mysql.promise().query(query);
    }

    return (!result[0].warningStatus) ? true : false;
}


module.exports = modelMysql;
