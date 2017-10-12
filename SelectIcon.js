f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.SelectIcon = function (Select) {
    this.elementSelect = Select;
    this.listOutsideClass = [];
    var self= this;
    this.elementSelect.addEventListener('change',function(){self.refreshClassSelect()});
    this.refreshClassSelect();
}
f00x.SelectIcon.prototype.elementSelect = false;
f00x.SelectIcon.prototype.listOutsideClass = false;

f00x.SelectIcon.prototype.refreshClassSelect = function () {
    var self= this;
    var optionActive = this.elementSelect.querySelector('option:checked');
    this.listOutsideClass.forEach(function (className) {
        self.elementSelect.classList.remove(className);

    })
    this.listOutsideClass = [];

    if (optionActive instanceof Element) {
        optionActive.classList.forEach(function (className) {
            self.listOutsideClass.push(className);
            self.elementSelect.classList.add(className);
        })
    }

}

