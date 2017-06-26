/* 
 *  Библиотека для преобразования Symfony collectionType поля в удобную форму на основе  стилей bootstrap
 */
/*22.07.2017 f00x autor:f00x mail:httpf00x@gmail.com*/

f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.OneToManyField = function (boxListElement, callBackTextMenuItem, labelForm) {
//    this.eventLoadEnd = new f00x.event('LoadEnd');
    this.labelForm = labelForm;

    if (!boxListElement instanceof Element) {
        console.error('error boxListElement not Element');
        return false;
    }
    this.eventFormSaveAndClose = new f00x.event('FormSaveAndClose', this);
    this.eventAddForm = new f00x.event('AddItemForm', this);
    this.elementListBox = boxListElement;
    this.name = 'f00x.OneToManyField';
    this.init(callBackTextMenuItem);
    return this;
}
f00x.OneToManyField.prototype.name = false;
f00x.OneToManyField.prototype.elementListBox = false;
f00x.OneToManyField.prototype.listChildrenElementForms = false;
f00x.OneToManyField.prototype.elementBase = false;
f00x.OneToManyField.prototype.elementMenu = false;
f00x.OneToManyField.prototype.elementLableBase = false;
f00x.OneToManyField.prototype.elementMenu = false;
f00x.OneToManyField.prototype.labelForm = '';

f00x.OneToManyField.prototype.eventFormSaveAndClose = false;
f00x.OneToManyField.prototype.eventAddForm = false;

f00x.OneToManyField.prototype.init = function (callBackTextMenuItem) {
    this.distributionElements();
    this.baseElementInit();
    this.elementMenu = this.createMenu();
    this.listMenuItem = [];

    if (callBackTextMenuItem && callBackTextMenuItem.call) {
        this.callBackTextMenuItem = callBackTextMenuItem;
    } else {
        this.callBackTextMenuItem = this.defaultCallBackTextMenuItem;
    }
    for (var keyElement in this.listChildrenElementForms) {
        if (!isFinite(keyElement))
            break;
        var ElementChildrenForm = this.listChildrenElementForms[keyElement];
        ElementChildrenForm.setAttribute('data-OneToMany-key', keyElement);

        var textMenuItem = this.callBackTextMenuItem(ElementChildrenForm)
        var elementMenuItem = this.createMenuItem(textMenuItem, keyElement);
        this.listMenuItem[keyElement] = elementMenuItem;
        this.elementMenu.appendChild(elementMenuItem);

        this.formItemInit(ElementChildrenForm);
    }
    this.elementListBox.appendChild(this.elementMenu);

}

f00x.OneToManyField.prototype.baseElementInit = function () {
    this.elementBase.classList.add('panel', 'panel-default');
    var elementHead = document.createElement('div');
    elementHead.classList.add('panel-heading', 'container-fluid');
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');
    var elementButtonAdd = document.createElement('button');
    elementButtonAdd.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-plus');

    var self = this;
    elementButtonAdd.addEventListener('click', function () {
        self.addClick();

    });
    elementButtonGroup.appendChild(elementButtonAdd);

    this.elementLableBase.style.display = "block";
    this.elementLableBase.classList.add('col-md-10');
    

    elementHead.appendChild(this.elementLableBase);
    elementHead.appendChild(elementButtonGroup);
    this.elementBase.insertBefore(elementHead, this.elementListBox);
    this.elementListBox.classList.add('panel-body')
    this.elementButtonAdd = elementButtonAdd;
}

f00x.OneToManyField.prototype.formItemInit = function (ElementChildrenForm)
{

    ElementChildrenForm.classList.add('OneToMany_edit_item');
    ElementChildrenForm.classList.add('panel', 'panel-default', 'hidden');
    var headForm = document.createElement('div');
    headForm.classList.add('panel-heading', 'container-fluid');
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');

    /*var elementButtonSave = document.createElement('button');
     elementButtonSave.classList.add('btn', 'btn-success', 'glyphicon', 'glyphicon-floppy-disk')*/

    var elementButtonClose = document.createElement('button');
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

f00x.OneToManyField.prototype.distributionElements = function ()
{
    this.elementBase = this.elementListBox.parentNode;
    this.elementLableBase = this.elementBase.querySelector('label');
    this.listChildrenElementForms = this.elementListBox.childNodes;
}

f00x.OneToManyField.prototype.createMenu = function ()
{
    var elementMenu = document.createElement('ul');
    elementMenu.classList.add('list-group', 'OneToMany_menu_list');
    return elementMenu;

}
f00x.OneToManyField.prototype.createMenuItem = function (textItem, key)
{
    var elementItem = document.createElement('li');
    elementItem.classList.add('list-group-item', 'OneToMany_menu_item', 'row');
    elementItem.setAttribute('data-OneToMany-key', key);

    var elementText = document.createElement('span');
    elementText.innerHTML = textItem;
    elementText.classList.add('OneToMany_item_text', 'col-md-10');
    var elementButtonGroup = document.createElement('div');
    elementButtonGroup.classList.add('btn-group', 'btn-group-sm', 'pull-right');

    var elementButtonEdit = document.createElement('button');
    elementButtonEdit.classList.add('btn', 'btn-primary', 'glyphicon', 'glyphicon-pencil');
    self = this;
    elementButtonEdit.addEventListener('click', function () {
        self.editClick(this.parentNode.parentNode)
    })

    var elementButtonDelete = document.createElement('button');
    elementButtonDelete.classList.add('btn', 'btn-danger', 'glyphicon', 'glyphicon-trash');

    elementButtonDelete.addEventListener('click', function () {
        self.deleteClick(this.parentNode.parentNode)
    })

    elementItem.appendChild(elementText);
    elementItem.appendChild(elementButtonGroup);
    elementButtonGroup.appendChild(elementButtonEdit);
    elementButtonGroup.appendChild(elementButtonDelete);

    return elementItem
}
f00x.OneToManyField.prototype.editClick = function (elementMenuItem)
{
    var key = elementMenuItem.getAttribute('data-OneToMany-key');

    f00x.element.show(this.listChildrenElementForms[key]);
    f00x.element.hide(this.elementMenu);
    this.elementButtonAdd.disabled = true;
}
f00x.OneToManyField.prototype.deleteClick = function (elementMenuItem)
{
    var key = elementMenuItem.getAttribute('data-OneToMany-key');
    this.elementMenu.removeChild(elementMenuItem);

    this.elementListBox.removeChild(this.listChildrenElementForms[key]);

}
f00x.OneToManyField.prototype.addClick = function ()
{
    var formItemHTML = this.elementListBox.getAttribute('data-prototype');

    var numberNewElement = this.listChildrenElementForms.length - 1;
    formItemHTML = formItemHTML.replace(/__name__label__/g, this.labelForm);
    formItemHTML = formItemHTML.replace(/__name__/g, numberNewElement);


    var container = document.createElement('div');
    container.innerHTML = formItemHTML;

    var newFormElement = container.firstChild;
    console.log(container);
    newFormElement.setAttribute('data-OneToMany-key', numberNewElement);
    this.formItemInit(newFormElement);


    this.elementListBox.insertBefore(newFormElement, this.listChildrenElementForms[numberNewElement]);

    var menuItem = this.createMenuItem('', numberNewElement);
    this.editClick(menuItem);
    this.elementMenu.appendChild(menuItem);
    this.eventAddForm.call(newFormElement);
    this.listMenuItem[numberNewElement] = menuItem;
}

f00x.OneToManyField.prototype.saveAndCloseClick = function (elementFormItem)
{

    f00x.element.hide(elementFormItem);
    this.eventFormSaveAndClose.call(elementFormItem);

    this.updateMenuItem(elementFormItem);
    f00x.element.show(this.elementMenu);
    this.elementButtonAdd.disabled = false;

}
f00x.OneToManyField.prototype.updateMenuItem = function (elementFormItem)
{
    var key = elementFormItem.getAttribute('data-OneToMany-key');
    var text = this.callBackTextMenuItem(elementFormItem);
    console.log(text)

    this.listMenuItem[key].querySelector('.OneToMany_item_text').innerHTML = text;

}

f00x.OneToManyField.prototype.defaultCallBackTextMenuItem = function (formElement)
{
    var text = '';
    var list = formElement.querySelectorAll('input, textarea');
    for (var key  in list)
    {
        if (!isFinite(key))
            break;
        text += '<p>' + list[key].value + '</p>';
    }
    return text;

}

