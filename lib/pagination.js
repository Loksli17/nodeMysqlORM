function Pagination(_params){
    if(_params.page != undefined){
        _params.page = _params.page;
        _params.url = _params.url.substring(0, _params.url.length - (6 + _params.page.toString().length));
    }else{
        _params.page = 1;
    }

    this.pageSize   = _params.pageSize;
    this.limit      = _params.limit;
    this.url        = _params.url;
    this.url        += this.checkRoute();
    this.count      = _params.count;
    this.maxPage    = Math.ceil(_params.count / this.limit);
    this.page       = _params.page;
    if(this.page > this.maxPage){
        this.page = this.maxPage;
    }
    this.skip       = this.limit * (this.page - 1);
}

Pagination.prototype.checkRoute = function(){
    for(let i = 0; i < this.url.length; i++){
        if(this.url[i] == "?"){
            return "&";
        }
    }
    return "?";
}


Pagination.prototype.getPages = function(){

    if(this.count <= this.limit){
        return [];
    }

    //определение крайних ссылок
    let first = 0,
        last  = 0,
        pages = new Array();

    if(Number(this.page) + (this.pageSize / 2) >= this.maxPage){
        last = this.maxPage;
        first = this.maxPage - this.pageSize + 1;
    }else if(Number(this.page) - (this.pageSize / 2) <= 1){
        first = 1;
        last = this.pageSize;
    }else{
        if(this.page < this.maxPage / 2){
            first = Math.floor(Number(this.page) - this.pageSize / 2);
        }else{
            first = Math.ceil(Number(this.page) - this.pageSize / 2);
        }
        last = first + this.pageSize - 1;
    }
    if(last > this.maxPage){
        last = this.maxPage;
    }
    if(first < 1){
        first = 1;
    }

    //создание массива
    if(this.page > 1){
        pages.push({id: Number(this.page) - 1, route: this.url, content: "<<"});
    }

    for(let i = first; i <= last; i++){
        let page = {
            id: i,
            route: this.url,
            content: i,
        };

        if(i == this.page){
            page.current = true;
            pages.push(page);
        }else{
            pages.push(page);
        }
    }

    if(this.page < this.maxPage){
        pages.push({id: Number(this.page) + 1, route: this.url, content: ">>", count: this.maxPage});
    }

    if(pages.length != 1){
        return pages;
    }else{
        return [];
    }

}

module.exports = Pagination;


/*ИСПОЛЬЗОВАНИЕ В КОНТРОЛЛЕРЕ ПИСАТЬ ТАК*/
/*
ОБЬЕКТ ПАГИНАЦИИ
let pagination = new Pagination({
    pageSize  : 4,
    limit     : 4,
    page      : page,
    url       : '/user',
    count     : count,
});

ЗАПРОС
let result = await User.find().skip(pagination.skip).limit(pagination.limit);

РЕНДЕР МАССИВА КНОПОК
res.render('user/user', {
    users: users,
    pages: pagination.getPages(),
});
*/
