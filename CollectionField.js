/* 
 *  Библиотека для преобразования Symfony collectionType поля в удобную форму на основе  стилей bootstrap
 */
/*22.07.2017 f00x autor:f00x mail:httpf00x@gmail.com*/

f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.CollectionField = function (boxListElement, callBackTextMenuItem, labelForm, callBackDelete, callBackError) {
//    this.eventLoadEnd = new f00x.event('LoadEnd');
    this.labelForm = labelForm;

    if (!boxListElement instanceof Element) {
        console.error('error boxListElement not Element');
        return false;
    }


    this.eventFormSaveAndClose = new f00x.event('FormSaveAndClose', this);
    this.eventAddForm = new f00x.event('AddItemForm', this);

    this.elementListBox = boxListElement;
    this.name = 'f00x.CollectionField';
    this.init(callBackTextMenuItem, callBackDelete, callBackError);
    return this;
}
f00x.CollectionField.prototype.name = false;
f00x.CollectionField.prototype.elementListBox = false;
f00x.CollectionField.prototype.listChildrenElementForms = false;
f00x.CollectionField.prototype.elementBase = false;
f00x.CollectionField.prototype.elementMenu = false;
f00x.CollectionField.prototype.elementLableBase = false;
f00x.CollectionField.prototype.labelForm = '';

f00x.CollectionField.prototype.eventFormSaveAndClose = false;
f00x.CollectionField.prototype.eventAddForm = false;

f00x.CollectionField.prototype.callBackDelete = false;
f00x.CollectionField.prototype.callBackError = false;
f00x.CollectionField.prototype.init = function (callBackTextMenuItem, callBackDelete, callBackError) {
    this.distributionElements();
    this.baseElementInit();
    this.elementMenu = this.createMenu();
    this.listMenuItem = [];
    if (callBackError && callBackError.call) {
        this.callBackError = callBackError;
    } else {
        this.callBackError = function () {
            alert('Ошибка заполнения')
        };
    }
    if (callBackDelete && callBackDelete.call) {
        this.callBackDelete = callBackDelete;
    } else
    {
        this.callBackDelete = this.deleteClick;
    }
    if (callBackTextMenuItem && callBackTextMenuItem.call) {
        this.callBackTextMenuItem = callBackTextMenuItem;
    } else {
        this.callBackTextMenuItem = this.defaultCallBackTextMenuItem;
    }
    var self = this
    this.listChildrenElementForms.forEach(function (ElementChildrenForm, keyElement) {
        if(ElementChildrenForm instanceof Element){
        ElementChildrenForm.setAttribute('data-collection-key', keyElement);

        var textMenuItem = self.callBackTextMenuItem(ElementChildrenForm)
        var elementMenuItem = self.createMenuItem(textMenuItem, keyElement);
        self.listMenuItem[keyElement] = elementMenuItem;
        self.elementMenu.appendChild(elementMenuItem);

        self.formItemInit(ElementChildrenForm);
    }
    })

    this.elementPanelBody.appendChild(this.elementMenu);

}

f00x.CollectionField.prototype.baseElementInit = function () {
    this.elementBase.classList.add('panel', 'panel-default');
    this.elementPanelBody = this.createPanelBody()

    var elementHead = this.createPanelHead();
    this.elementBase.insertBefore(elementHead, this.elementListBox);
    this.elementBase.appendChild(this.elementPanelBody)
    this.elementPanelBody.appendChild(this.elementListBox);
//    this.elementListBox.classList.add('panel-body')

}

f00x.CollectionField.prototype.formItemInit = function (ElementChildrenForm)
{

    ElementChildrenForm.classList.add('collection_edit_item');
    ElementChildrenForm.classList.add('panel', 'panel-default', 'hidden');
    var headForm = document.createElement('div');
    headForm.classList.add('panel-heading', 'container-fluid');
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');

    /*var elementButtonSave = document.createElement('div');
     elementButtonSave.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-floppy-disk')*/

    var elementButtonClose = document.createElement('div');
    elementButtonClose.classList.add('btn', 'btn-default', 'glyphicon', 'glyphicon-remove');
    var self = this;
    elementButtonClose.addEventListener('click', function () {
        self.saveAndCloseClick(this.parentNode.parentNode.parentNode);
    });
    /*elementButtonGroup.appendChild(elementButtonSave);*/
    elementButtonGroup.appendChild(elementButtonClose);

    var labelElementChildren = ElementChildrenForm.firstChild;
    labelElementChildren.classList.add('col-md-10');

    var bodyElementChildren = ElementChildrenForm.childNodes[1];

    bodyElementChildren.classList.add('panel-body');

    headForm.appendChild(labelElementChildren);
    headForm.appendChild(elementButtonGroup);
    ElementChildrenForm.insertBefore(headForm, bodyElementChildren);

}

f00x.CollectionField.prototype.distributionElements = function ()
{
    this.elementBase = this.elementListBox.parentNode;
    this.elementLableBase = this.elementBase.querySelector('label');
    this.listChildrenElementForms = Array.prototype.slice.call(this.elementListBox.childNodes);
}
f00x.CollectionField.prototype.createPanelHead = function ()
{
    var elementHead = document.createElement('div');
    elementHead.classList.add('panel-heading', 'container-fluid');
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');
    var elementButtonAdd = document.createElement('div');
    elementButtonAdd.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-plus');
    this.elementButtonAdd = elementButtonAdd;
    var self = this;
    elementButtonAdd.addEventListener('click', function () {
        self.addClick();

    });
    elementButtonGroup.appendChild(elementButtonAdd);

    this.elementLableBase.style.display = "block";
    this.elementLableBase.classList.add('col-md-10');


    elementHead.appendChild(this.elementLableBase);
    elementHead.appendChild(elementButtonGroup);
    return  elementHead
}
f00x.CollectionField.prototype.createPanelBody = function ()
{
    var element = document.createElement('div');
    element.classList.add('panel-body');
    return element;

}
f00x.CollectionField.prototype.createMenu = function ()
{
    var elementMenu = document.createElement('ul');
    elementMenu.classList.add('list-group', 'collection_menu_list');
    return elementMenu;

}
f00x.CollectionField.prototype.createMenuItem = function (textItem, key)
{
    var elementItem = document.createElement('li');
    elementItem.classList.add('list-group-item', 'collection_menu_item', 'row');
    elementItem.setAttribute('data-collection-key', key);

    var elementText = document.createElement('span');
    elementText.innerHTML = textItem;
    elementText.classList.add('collection_item_text', 'col-md-10');
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');

    var elementButtonEdit = document.createElement('div');
    elementButtonEdit.classList.add('btn', 'btn-primary', 'glyphicon', 'glyphicon-pencil');
    var self = this;
    elementButtonEdit.addEventListener('click', function () {
        self.editClick(this.parentNode.parentNode)
    })

    var elementButtonDelete = document.createElement('div');
    elementButtonDelete.classList.add('btn', 'btn-danger', 'glyphicon', 'glyphicon-trash');

    elementButtonDelete.addEventListener('click', function () {
        self.callBackDelete(this.parentNode.parentNode, self);
    })

    elementItem.appendChild(elementText);
    elementItem.appendChild(elementButtonGroup);
    elementButtonGroup.appendChild(elementButtonEdit);
    elementButtonGroup.appendChild(elementButtonDelete);

    return elementItem
}
f00x.CollectionField.prototype.editClick = function (elementMenuItem)
{
    var key = this.getKeyItemByElementFormOrMenu(elementMenuItem);

    f00x.element.show(this.listChildrenElementForms[key]);
    f00x.element.hide(this.elementMenu);
    this.elementButtonAdd.disabled = true;
}
f00x.CollectionField.prototype.deleteClick = function (elementMenuItem)
{
    var key = this.getKeyItemByElementFormOrMenu(elementMenuItem);
    this.elementMenu.removeChild(elementMenuItem);

    this.elementListBox.removeChild(this.listChildrenElementForms[key]);
    delete this.listChildrenElementForms[key];

}
f00x.CollectionField.prototype.addClick = function ()
{
    var formItemHTML = this.elementListBox.getAttribute('data-prototype');

    var numberNewElement = this.listChildrenElementForms.length;
    formItemHTML = formItemHTML.replace(/__name__label__/g, this.labelForm);
    formItemHTML = formItemHTML.replace(/__name__/g, numberNewElement);


    var container = document.createElement('div');
    container.innerHTML = formItemHTML;

    var newFormElement = container.firstChild;
    console.log(container);
    newFormElement.setAttribute('data-collection-key', numberNewElement);
    this.formItemInit(newFormElement);


    this.elementListBox.appendChild(newFormElement);
    this.listChildrenElementForms.push(newFormElement);

    var menuItem = this.createMenuItem('', numberNewElement);
    this.elementMenu.appendChild(menuItem);
    this.eventAddForm.call(newFormElement);

    this.listMenuItem[numberNewElement] = menuItem;
    this.setNumberItemCollection(numberNewElement, 'new' + numberNewElement);
    this.editClick(menuItem);

}

f00x.CollectionField.prototype.saveAndCloseClick = function (elementFormItem)
{

    
    this.eventFormSaveAndClose.call(elementFormItem);
    
    if (!this.validateItemForm(this.getKeyItemByElementFormOrMenu(elementFormItem))) {
        this.callBackError();
    }
    f00x.element.hide(elementFormItem);
    this.updateMenuItem(elementFormItem);
    f00x.element.show(this.elementMenu);
    this.elementButtonAdd.disabled = false;
    


}
f00x.CollectionField.prototype.updateMenuItem = function (elementFormItem)
{
    var key = this.getKeyItemByElementFormOrMenu(elementFormItem);
    var text = this.callBackTextMenuItem(elementFormItem);


    this.listMenuItem[key].querySelector('.collection_item_text').innerHTML = text;

}

f00x.CollectionField.prototype.defaultCallBackTextMenuItem = function (formElement)
{
    var list = formElement.querySelectorAll('input, textarea');
    var text = '<table class="table table-bordered" ><tr>';
    list.forEach(function (textItem) {
        return text += '<td>' + textItem.value + '</td>';
    });
    text += '</tr></table>';
    return text;

}
f00x.CollectionField.prototype.getNumberItemCollection = function (key)
{
    var formBody = this.listChildrenElementForms[key].querySelector('.panel-body');

    var idForm = formBody.getAttribute('id');

    var res = /\_([^\_]+)$/g.exec(idForm);

    return res[1];
}
f00x.CollectionField.prototype.setNumberItemCollection = function (key, id)
{
    var formBody = this.listChildrenElementForms[key].querySelector('.panel-body');
    var idForm = formBody.getAttribute('id');
    var prefixArray = /(^.*_)[^\_]+$/g.exec(idForm);

    formBody.setAttribute('id', prefixArray[1] + id);
    return this;
}
f00x.CollectionField.prototype.disabledMenuItem = function (elementMenuItem) {
    elementMenuItem.classList.add('disabled');
    var listButton = elementMenuItem.querySelectorAll('.btn');
    listButton.forEach(function (element) {
        f00x.element.hide(element);
    })
}


f00x.CollectionField.prototype.createPostNameFieldList = function (listElementData, formName) {
    listElementData.forEach(function (elementData) {
        var name = elementData.getAttribute('name');
        var searchResult = /\[(.[^\]]+)\]$/g.exec(name)
        if (searchResult) {
            var nameField = searchResult[0];
            var postItemName = formName + nameField;
            elementData.setAttribute('data-post-name', postItemName);
        }
    });
    return listElementData;
}

f00x.CollectionField.prototype.getObjectFieldListByPostName = function (listElementData) {
    var postObject = {};
    listElementData.forEach(function (elementData) {
        var postItemName = elementData.getAttribute('data-post-name');
        postObject[postItemName] = elementData.value;
    });
    return postObject;
}
f00x.CollectionField.prototype.addErrorItem = function (keyElement) {
    this.listMenuItem[keyElement].classList.add('list-group-item-danger')

}
f00x.CollectionField.prototype.removeErrorItem = function (keyElement) {
    this.listMenuItem[keyElement].classList.remove('list-group-item-danger')

}
f00x.CollectionField.prototype.validateAllItemsForm = function () {
    var self = this;
    var validate = true;
    this.listChildrenElementForms.forEach(function (element, key) {

        if (!self.validateItemForm(key)) {
            validate = false;
        }
    });

    return validate;
}
f00x.CollectionField.prototype.validateItemForm = function (key)
{
    var element = this.listChildrenElementForms[key];
    var InputArray = Array.from(element.querySelectorAll('[required]'));

    var valid = true
    InputArray.some(function (element) {
        if (!element.validity.valid) {
            valid = false;
            return true;
        }
    })
//        console.log(element);
    if (!valid) {
//            console.log(element);
        this.addErrorItem(key);

    } else {
        this.removeErrorItem(key);
    }
    return valid;
}
f00x.CollectionField.prototype.getKeyItemByElementFormOrMenu = function (elementFormOrMenu)
{
    return elementFormOrMenu.getAttribute('data-collection-key');
}

