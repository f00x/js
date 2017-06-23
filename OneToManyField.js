/* 
 *  Библиотека для преобразования Symfony collectionType поля в удобную форму на основе  стилей bootstrap
 */
/*22.07.2017 f00x autor:f00x mail:httpf00x@gmail.com*/

f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.OneToManyField = function (boxListElement) {
//    this.eventLoadEnd = new f00x.event('LoadEnd');
    
    if (!boxListElement instanceof Element) {
        console.error('error boxListElement not Element');
        return false;
    }
    this.boxListElement = boxListElement;
    this.name = 'f00x.OneToManyField';
    return this;
}
f00x.OneToManyField.prototype.name = false;
f00x.OneToManyField.prototype.boxListElement = false;
f00x.OneToManyField.prototype.listChildrenElementForms = false;
f00x.OneToManyField.prototype.baseElement = false;

f00x.OneToManyField.prototype.headListElement = false;

f00x.OneToManyField.prototype.init = function () {
    this.distributionElements();
    this.baseElement.ClassList.add('panel', 'panel-default');

    this.headListElement.style.display = "block";
    this.headListElement.ClassList.add('panel-heading')

    this.boxListElement.ClassList.add('panel-body')
    for (var ElementChildrenForm in this.listChildrenElementForms) {
        ElementChildrenForm.ClassList.add('panel', 'panel-default');
        var labelElementChildren = ElementChildrenForm.childNodes.item();
        labelElementChildren.style.display = "block";
        labelElementChildren.ClassList.add('panel-heading')
        var bodyElementChildren = ElementChildrenForm.childNodes.item();
        bodyElementChildren.ClassList.add('panel-body');
    }
}

f00x.OneToManyField.prototype.distributionElements = function ()
{
    this.baseElement = this.boxListElement.parentNode;
    console.log(this.baseElement);
    this.headListElement = this.baseElement.querySelector('label');
    this.listChildrenElementForms = this.boxListElement.childNodes;


}
