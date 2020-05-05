module.exports.formatDbDate = (d_) => {
    let
        date = new Date(d_);

    let
        d = date.getDate(),
        m = date.getMonth() + 1,
        y = date.getFullYear();

    d > 10 ? false : d = "0" + d;
    m > 10 ? false : m = "0" + m;

    return y + "-" + m + "-" + d;
}


module.exports.formatDbTime = (d_) => {
    let
        date = new Date(d_);

    let
        s = date.getSeconds(),
        m = date.getMinutes(),
        h = date.getHours();

    s > 10 ? false : s = "0" + s;
    m > 10 ? false : m = "0" + m;
    h > 10 ? false : h = "0" + h;

    return h + ":" + m + ":" + s;
}


module.exports.getAge = (d_) => {
    let
        date = new Date(d_);

    let
        d   = date.getDate(),
        m   = date.getMonth(),
        y   = date.getFullYear(),
        now = new Date(),
        age = 0;

    let
        dn = now.getDay(),
        mn = now.getMonth(),
        yn = now.getFullYear();

    age = yn - y;
    if(mn < m){
        age--;
    }else if(mn == m && y >= yn){
        age--;
    }
    if(age < 0) age = 0;

    return age;
}


module.exports.formatViewDate = (d_) => {

    let
        date = new Date(d_);

    let
        d = date.getDate(),
        m = date.getMonth() + 1,
        y = date.getFullYear();

    switch(m){
        case 1:
            m = "Января";
            break;
        case 2:
            m = "Февраля";
            break;
        case 3:
            m = "Марта";
            break;
        case 4:
            m = "Апреля";
            break;
        case 5:
            m = "Мая";
            break;
        case 6:
            m = "Июня";
            break;
        case 7:
            m = "Июля";
            break;
        case 8:
            m = "Августа";
            break;
        case 9:
            m = "Сентября";
            break;
        case 10:
            m = "Октября";
            break;
        case 11:
            m = "Ноября";
            break;
        case 12:
            m = "Декабря";
            break;
    }

    return d + " " + m + " " + y;
}
