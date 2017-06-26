/*26.07.2017 f00x autor:f00x mail:httpf00x@gmail.com*/
/*
 * Создаёт список с выделением классы bootstrap, на основе элкмента select 
 * Изменение поля селект производится паралельно.
 *
 */
f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.SelectMultiple = function (elementSelect, elementLabel, callBackTextItem, isVisibleEditListButton, isVisibleAddButton) {

    f00x.element.hide(elementSelect);
    this.callBackTextItem = callBackTextItem;
    this.elementSelect = elementSelect;
    this.elementBase = this.createElementBase();
    this.elementBody = this.createElementBody();
    this.elementHead = this.createElementHead();
    this.elementHeadLabel = this.elementHead.firstChild;
    this.elementList = this.createElementList();
    var self = this;
    if (isVisibleEditListButton || isVisibleAddButton) {
        this.elementButtonGroup = this.createElementButtonGroup();
        if (isVisibleAddButton) {
            this.eventAddClick = new f00x.event('AddButtonClick', this);
            this.elementButtonAdd = this.createElementButtonAdd()
            console.log(this.elementButtonAdd);
            this.elementButtonAdd.addEventListener('click', function () {
                self.eventAddButtonClick.call(self.elementBase)
            });
            this.elementButtonGroup.appendChild(this.elementButtonAdd);
        }
        if (isVisibleEditListButton) {
            this.eventEditListButtonClick = new f00x.event('EditListButtonClick', this);
            this.elementButtonEditList = this.createElementButtonEditList()

            this.elementButtonEditList.addEventListener('click', function () {
                self.eventEditListButtonClick.call(self.elementBase)
            });
            this.elementButtonGroup.appendChild(this.elementButtonEditList);
        }

        this.elementHead.appendChild(this.elementButtonGroup);
        this.elementBase.appendChild(this.elementHead);

    }
    if (elementLabel instanceof Element)
    {
        this.elementHeadLabel.appendChild(elementLabel);
        this.elementBase.appendChild(this.elementHead);

    }
    this.elementBody.appendChild(this.elementList);
    this.elementBase.appendChild(this.elementBody);
    this.initListOptions()
    this.elementSelect.parentNode.insertBefore(this.elementBase,this.elementSelect);
}
f00x.SelectMultiple.prototype.elementSelect = false;
f00x.SelectMultiple.prototype.elementBase = false;
f00x.SelectMultiple.prototype.elementList = false;
f00x.SelectMultiple.prototype.elementBody = false;
f00x.SelectMultiple.prototype.elementHead = false;
f00x.SelectMultiple.prototype.elementHeadLabel = false;
f00x.SelectMultiple.prototype.elementButtonGroup = false;
f00x.SelectMultiple.prototype.elementButtonEditList = false;
f00x.SelectMultiple.prototype.elementButtonAdd = false;
f00x.SelectMultiple.prototype.elementButtonGroup = false;

f00x.SelectMultiple.prototype.eventAddClick = false;
f00x.SelectMultiple.prototype.eventEditListButtonClick = false;

f00x.SelectMultiple.prototype.callBackTextItem = false;

f00x.SelectMultiple.prototype.initListOptions = function ()
{
    var listOptions = this.elementSelect.childNodes;
    this.elementList.innerHTML = '';
    for (var key in listOptions)
    {
        if (!isFinite(key))
            break;
        var elementOptions = listOptions[key];
        var text = this.callBackTextItem(elementOptions);
        var item = this.createElementItem(key, text);
        if (elementOptions.selected) {
            item.classList.add('active')
        }
        this.elementList.appendChild(item);
    }

}
f00x.SelectMultiple.prototype.createElementItem = function (key, text)
{
    var elementItem = document.createElement('li');
    elementItem.classList.add('list-group-item', 'SelectMultiple_item', 'row');
    elementItem.setAttribute('data-SelectMultiple-key', key);
    var self = this;
    elementItem.addEventListener('click', function () {
        self.selectByKey(key)
    })
    elementItem.innerHTML=text;
    return elementItem

}
f00x.SelectMultiple.prototype.createElementButtonGroup = function ()
{
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');
    return elementButtonGroup;
}
f00x.SelectMultiple.prototype.createElementButtonAdd = function ()
{
var elementButton = document.createElement('button');
    elementButton.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-plus');
    return elementButton
}
f00x.SelectMultiple.prototype.createElementButtonEditList = function ()
{
var elementButton = document.createElement('button');
    elementButton.classList.add('btn', 'btn-primary', 'glyphicon', 'glyphicon-list');
    return elementButton
}
f00x.SelectMultiple.prototype.createElementBase = function ()
{
    var element = document.createElement('div');
    element.classList.add('panel', 'panel-default');
    return element;
}
f00x.SelectMultiple.prototype.createElementBody = function (){
     var elementBody = document.createElement('div');
    elementBody.classList.add('panel-body');
    return elementBody;
}
f00x.SelectMultiple.prototype.createElementList = function ()
{
    var elementList = document.createElement('ul');
    elementList.classList.add('list-group', 'SelectMultiple_list');
    return elementList;

}
f00x.SelectMultiple.prototype.createElementHead = function ()
{
    var elementHead = document.createElement('div');
    elementHead.classList.add('panel-heading', 'container-fluid');
    var elementLabel = document.createElement('div');
    elementLabel.classList.add('col-md-10');
    elementHead.appendChild(elementLabel);
    return elementHead
}
f00x.SelectMultiple.prototype.selectByKey = function (key)
{   console.log(this);
    console.log(key);
    if (!this.elementSelect.childNodes[key].selected) {
        this.elementSelect.childNodes[key].selected = true;
        this.elementList.childNodes[key].classList.add('active');
    } else
    {
        this.elementSelect.childNodes[key].selected = false;
        this.elementList.childNodes[key].classList.remove('active');
    }
}


