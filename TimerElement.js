f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};

f00x.TimerElement = function (element, second, mask) {
    if (element instanceof Element) {
        this.mask = mask || this.mask;
        this.element = element;
        this.intervalSecond = second || this.intervalSecond;
        this.DateTimeFinish = new Date(element.getAttribute('data-time-finish'));
        this.start();
    }
}
f00x.TimerElement.prototype.mask = "%dd %h:%i:%s";
f00x.TimerElement.prototype.element = false;
f00x.TimerElement.prototype.DateTimeFinish = false;
f00x.TimerElement.prototype.intervalId = false;
f00x.TimerElement.prototype.intervalSecond = 1;

f00x.TimerElement.prototype.updateMsg = function () {
    this.element.innerHTML = this.getMsg();

}
f00x.TimerElement.prototype.getMsg = function () {
    var diffTime = this.DateTimeFinish - (new Date());


    if (diffTime > 0) {
        var diffDateTime = new Date();
        diffDateTime.setTime(diffTime);
        var name = this.mask;
        name = name.replace(/%d/g, diffDateTime.getUTCDate() - 1);
        name = name.replace(/%h/g, diffDateTime.getUTCHours().toString().padStart(2, '0'));
        name = name.replace(/%i/g, diffDateTime.getUTCMinutes().toString().padStart(2, '0'));
        name = name.replace(/%s/g, diffDateTime.getUTCSeconds().toString().padStart(2, '0'));
    } else {
        var name = this.mask;
        name = name.replace(/%d/g, 0);
        name = name.replace(/%h/g, "".padStart(2, '0'));
        name = name.replace(/%i/g, "".padStart(2, '0'));
        name = name.replace(/%s/g, "".padStart(2, '0'));
    }
    return name;
}
f00x.TimerElement.prototype.start = function () {
    var self = this;

    this.intervalId = setInterval(function () {
        self.updateMsg()
    }, this.intervalSecond * 1000);
}
f00x.TimerElement.prototype.stop = function () {
    clearInterval(this.intervalId)
}
