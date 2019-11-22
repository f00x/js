/*26.07.2017 f00x autor:f00x mail:httpf00x@gmail.com*/
/*
 * Создаёт список с выделением классы bootstrap, на основе элкмента select
 * Изменение поля селект производится паралельно.
 *
 */
f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.SelectMultiple = function (elementSelect, elementLabel, callBackTextItem, isVisibleEditListButton, isVisibleAddButton, isMouseCtrlActive,isSelectAllButton) {
    this.listGroup={};
    if(isSelectAllButton||(typeof isSelectAllButton == "undefined")){ isSelectAllButton=true;}
    console.log(this);

    this.isMouseCtrlActive = isMouseCtrlActive;
    f00x.element.hide(elementSelect);
    if (callBackTextItem instanceof Function) {
        this.callBackTextItem = callBackTextItem;
    } else
    {
        this.callBackTextItem = this.defaultCallBackTextItem;
    }
    this.elementSelect = elementSelect;
    this.elementBase = this.createElementBase();
    this.elementBody = this.createElementBody();
    this.elementHead = this.createElementHead();
    this.elementHeadLabel = this.elementHead.firstChild;
    this.elementList = this.createElementList();
    var self = this;
    if (isVisibleEditListButton || isVisibleAddButton||isSelectAllButton) {
        this.elementButtonGroup = this.createElementButtonGroup();


        if (isVisibleAddButton) {
            this.eventAddClick = new f00x.event('AddButtonClick', this);
            this.elementButtonAdd = this.createElementButtonAdd()
            this.elementButtonAdd.addEventListener('click', function () {
                self.eventAddButtonClick.call(self.elementBase)
            });
            this.elementButtonGroup.appendChild(this.elementButtonAdd);
        }
         if(isSelectAllButton){
             this.elementButtonSelectAll=this.createElementButtonSelectAll();
          this.elementButtonGroup.appendChild( this.elementButtonSelectAll );
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
    this.elementSelect.parentNode.insertBefore(this.elementBase, this.elementSelect);

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
f00x.SelectMultiple.prototype.elementButtonSelectAll = false;
f00x.SelectMultiple.prototype.elementButtonGroup = false;

f00x.SelectMultiple.prototype.eventAddClick = false;
f00x.SelectMultiple.prototype.eventEditListButtonClick = false;

f00x.SelectMultiple.prototype.callBackTextItem = false;
f00x.SelectMultiple.prototype.isMouseCtrlActive = false;
f00x.SelectMultiple.prototype.listGroup = false;
f00x.SelectMultiple.prototype.listItemNonGroup = [];

f00x.SelectMultiple.prototype.CreateAllGroupAndItem = function ()
{
    var listOptions = this.elementSelect.childNodes;
    this.elementList.innerHTML = '';

    for (var key in listOptions)
    {
        if (!isFinite(key))
            break;
        var elementOptions = listOptions[key];
        var item = this.createByOptions(elementOptions,key)
        var groupCode = elementOptions.getAttribute('data-multiple-select-group-code');
        if (groupCode) {
            var groupName = elementOptions.getAttribute('data-multiple-select-group-name');
            groupName = groupName ? groupName : groupCode;

            if (!(this.listGroup[groupCode]  instanceof f00x.SelectMultipleGroupItem)) {
                this.listGroup[groupCode] = new f00x.SelectMultipleGroupItem(groupCode, groupName,this);
            }
            this.listGroup[groupCode].addChildrenElement(item);

        } else {
            this.listItemNonGroup.push(item);
        }


        //this.elementList.appendChild(item);
    }


}

f00x.SelectMultiple.prototype.createByOptions = function (elementOptions, key)
{

    var text = this.callBackTextItem(elementOptions);
    var item = this.createElementItem(key, text);

    if (elementOptions.selected) {
        item.classList.add('active')
    }
    return item;
}


f00x.SelectMultiple.prototype.initListOptions = function ()
{
    this.CreateAllGroupAndItem();
    this.elementList.innerHTML = '';
    for (var key in this.listGroup)
    {
        var group = this.listGroup[key];
        var item = group.createElement();
        this.elementList.appendChild(item);
    }
    for (var key in this.listItemNonGroup)
    {
        var item = this.listItemNonGroup[key];
        this.elementList.appendChild(item);
    }

}


f00x.SelectMultiple.prototype.createElementItem = function (key, text)
{ var elementItem = document.createElement('li');
    elementItem.classList.add('list-group-item', 'SelectMultiple_item', 'row');
    elementItem.setAttribute('data-SelectMultiple-key', key);
    var self = this;
    elementItem.addEventListener('click', function () {
        self.selectByKey(key);
    })
    if (this.isMouseCtrlActive) {
        elementItem.addEventListener('mouseover', this.mouseGtrlSelection);
    }
    elementItem.innerHTML = text;
    return elementItem
}
f00x.SelectMultiple.prototype.mouseGtrlSelection = function (event)
{
    if (event.target != this)
        return false;
    if (this.contains(event.relatedTarget))
        return false;
    if (event.ctrlKey) {
        this.click()
    }


}
f00x.SelectMultiple.prototype.createElementButtonGroup = function ()
{
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');
    return elementButtonGroup;
}
f00x.SelectMultiple.prototype.createElementButtonAdd = function ()
{
    var elementButton = document.createElement('div');
    elementButton.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-plus');
    return elementButton
}
f00x.SelectMultiple.prototype.createElementButtonEditList = function ()
{
    var elementButton = document.createElement('div');
    elementButton.classList.add('btn', 'btn-primary', 'glyphicon', 'glyphicon-list');
    return elementButton
}
f00x.SelectMultiple.prototype.createElementButtonSelectAll= function ()
{
   var elementButton = document.createElement('div');
    elementButton.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-ok');
    var self=this;
    elementButton.addEventListener('click',function(){
        self.selectAll(this);
    });

    return elementButton
}

f00x.SelectMultiple.prototype.createElementBase = function ()
{
    var element = document.createElement('div');
    element.classList.add('panel', 'panel-default');
    return element;
}
f00x.SelectMultiple.prototype.createElementBody = function () {
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


f00x.SelectMultiple.prototype.selectAll = function (button)
{
   //this.elementList.querySelector('[data-selectmultiple-key="'+key+'"]');
    var self = this
    if(button.classList.contains('on_all') ){
    button.classList.remove('on_all');
    }else{
       button.classList.add('on_all');
    }

    this.elementSelect.querySelectorAll('option').forEach(function(ChildrenElement,key){
//        var key=ChildrenElement.getAttribute('data-selectmultiple-key');

        if(!button.classList.contains('on_all') ){
           ChildrenElement.selected=true
        }else{
           ChildrenElement.selected=false
        }

        self.selectByKey(key);

    })

}
f00x.SelectMultiple.prototype.selectByKey = function (key)
{
    console.log(this);
    var elementItem=this.getElementByKey(key);
    if (!this.elementSelect.childNodes[key].selected) {
        this.elementSelect.childNodes[key].selected = true;
        elementItem.classList.add('active');
    } else
    {
        this.elementSelect.childNodes[key].selected = false;
        elementItem.classList.remove('active');
    }

    //data-selectmultiple-key="2"
}
f00x.SelectMultiple.prototype.getElementByKey = function (key)
{
   return this.elementList.querySelector('[data-selectmultiple-key="'+key+'"]');
}


f00x.SelectMultiple.prototype.defaultCallBackTextItem = function (element) {
    return element.innerHTML;
}

f00x.SelectMultipleGroupItem = function (key, text, SelectMultiple)
{

    this.key = key;
    this.text = text;
    this.SelectMultiple = SelectMultiple;
    this.ListChildrenElement = [];

}
f00x.SelectMultipleGroupItem.prototype.SelectMultiple
f00x.SelectMultipleGroupItem.prototype.key = false;
f00x.SelectMultipleGroupItem.prototype.text = false;
f00x.SelectMultipleGroupItem.prototype.ListChildrenElement = [];
f00x.SelectMultipleGroupItem.prototype.addChildrenElement = function (element) {
    this.ListChildrenElement.push(element);
}
f00x.SelectMultipleGroupItem.prototype.createElement = function ()
{
    var key = this.key;
    var text = this.text;
    var groupItem = document.createElement('li');
    groupItem.classList.add('list-group-item', 'SelectMultiple_group', 'row');
    groupItem.setAttribute('data-SelectMultiple-key', key);

    var elementText = document.createElement('span');
    elementText.classList.add('SelectMultiple_group_title');
    elementText.innerHTML = text;

//             groupItem.appendChild(elementText);
    var elementPanel
    var elementList = this.createElementList();

    elementList.classList.add('SelectMultiple_group_list_children');

    this.ListChildrenElement.forEach(function (elementChildren) {
        elementList.appendChild(elementChildren);
    })
    var elementPanel=this.createElementPanelChild(elementList,elementText);
    groupItem.appendChild(elementPanel);
    return groupItem
}

f00x.SelectMultipleGroupItem.prototype.createElementPanelChild=function(elementList,elementTextHead)
{
     var element = document.createElement('div');
    element.classList.add('panel', 'panel-info');
         var elementHead = document.createElement('div');
    elementHead.classList.add('panel-heading');
    elementHead.appendChild(elementTextHead);

    var elementbtnAll=this.createElementButtonSelectAll();
    elementHead.appendChild(elementbtnAll);
    element.appendChild(elementHead);

    var elementBody = document.createElement('div');
    elementBody.classList.add('panel-body');
    element.appendChild(elementBody);
    elementBody.appendChild(elementList);
    return element

}
f00x.SelectMultipleGroupItem.prototype.createElementButtonSelectAll = function ()
{
    var elementButton = document.createElement('div');
    elementButton.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-ok');
    var self=this;
    elementButton.addEventListener('click',function(){
        self.selectAll(this);
    });

    return elementButton
}
f00x.SelectMultipleGroupItem.prototype.selectAll = function (button)
{
    var self = this
    if(button.classList.contains('on_all') ){
    button.classList.remove('on_all');
    }else{
       button.classList.add('on_all');
    }

    this.ListChildrenElement.forEach(function(ChildrenElement){
        var key=ChildrenElement.getAttribute('data-selectmultiple-key');
//        console.log( self.SelectMultiple);
        if(!button.classList.contains('on_all') ){

            self.SelectMultiple.elementSelect.childNodes[key].selected=true
        }else{

            self.SelectMultiple.elementSelect.childNodes[key].selected=false
        }

        self.SelectMultiple.selectByKey(key);

    })
}

f00x.SelectMultipleGroupItem.prototype.createElementButtonDownUp = function ()
{
    var elementButton = document.createElement('div');
    elementButton.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-menu-down');


    //glyphicon-menu-up

    return elementButton
}

f00x.SelectMultipleGroupItem.prototype.createElementList = function ()
{
    var elementList = document.createElement('ul');
    elementList.classList.add('list-group', 'SelectMultiple_group_list');
    return elementList;

}
