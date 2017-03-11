/*11.03.2017 f00x autor:f00x mail:httpf00x@gmail.com*/
f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.swap = function () {
    this.eventLoadEnd = new f00x.event('LoadEnd');
     this.eventSendFilesBeforeProgressBar = new f00x.event('BeforeSendFiles');
    this.name = 'f00x.swap';
   f00x.swap.prototype.stackAboutFiles = [];
    return this;
};
f00x.swap.prototype.stackAboutFiles = false;
f00x.swap.prototype.url = '/'

f00x.swap.prototype.eventLoadEnd = false;
f00x.swap.prototype.eventSendFilesBeforeProgressBar=false;
f00x.swap.prototype.fileSourceInput = false;
f00x.swap.prototype.progressBarConainerElement = false;

/*-----*/

f00x.swap.prototype.sendPostFromFormData = function (formData)
{
    console.assert(formData instanceof FormData);
    var self = this;
    var link = new XMLHttpRequest();
    link.open("POST", this.url, true);
    link.addEventListener("loadend", function () {
        self.eventLoadEnd.scopeCall = this
        self.eventLoadEnd.call(self)
    });

    link.send(formData);
    return link;
}
f00x.swap.prototype.sendPostFromObject = function (obj)
{
    var formData = new FormData();
    for (var key in obj)
    {
        formData.append(key, obj[key]);
    }
    return this.sendPostFromFormData(formData)
}
f00x.swap.prototype.sendGetFromObject = function (obj)
{
    if (obj instanceof Object)
        this.url = this.getStringGET(obj, this.url);
    var link = new XMLHttpRequest();
    link.open("GET", this.url, true);

    var self = this;
    link.addEventListener("loadend", function () {
        self.eventLoadEnd.scopeCall = this
        self.eventLoadEnd.call(self)
    });
    link.send();
    return link;
}
f00x.swap.prototype.sendFile = function (file, postNameFiled, progressBar, isFileStack)
{

    console.assert(file instanceof File);
    postNameFiled = postNameFiled ? postNameFiled : 'file'

    var formData = new FormData();
    formData.append(postNameFiled, file);

    var link = new XMLHttpRequest();
    link.open("POST", this.url, true);

    if (progressBar instanceof f00x.progressBar) {
        link.addEventListener('progress', function (event) {
            progressBar.totalValue = event.total;
            progressBar.setCurrentValue(event.loaded);//this.loaded
        });
    }
    var self = this;
    if (isFileStack) {
        link.addEventListener("loadend", function () {
            self.sendStackFileItem();
            self.eventLoadEnd.scopeCall = this
            self.eventLoadEnd.call(self, progressBar)
        });
    } else {
        link.addEventListener("loadend", function () {

            self.eventLoadEnd.scopeCall = this
            self.eventLoadEnd.call(self, progressBar)
        });
    }

    link.send(formData);
};
f00x.swap.prototype.sendFiles = function (fileSourceInput, isSerialSending)
{
    console.assert(fileSourceInput instanceof Element);
//    this.fileSourceInput = fileSourceInput;
    fileSourceInput.disabled = true;
    var files = [];
    for (var i = 0; i < fileSourceInput.files.length; i++) {
        files.push(fileSourceInput.files[i]);
    }

    this.progressBarConainerElement = (this.progressBarConainerElement instanceof Element) ? this.progressBarConainerElement : fileSourceInput.parentNode;

    var self = this;
    var fileNameInput = fileSourceInput.name
    files.forEach(function () {
        console.assert(self.progressBarConainerElement instanceof Element)

        var progressBar = new f00x.progressBar();
        var file = arguments[0]

        progressBar.setName(file.name + '  Размер~(<tt>' + (file.size / 1024).toFixed(2) + 'KByte</tt>)');
        progressBar.totalValue = file.size;

        self.eventSendFilesBeforeProgressBar.call(progressBar, file);

        self.progressBarConainerElement.appendChild(progressBar.rootDivElement);
        if (isSerialSending)
        {
            self.stackAboutFiles.push(
                    {
                        'file': file,
                        'fileNameInput': fileNameInput,
                        'progressBar': progressBar,
                        'fileSourceInput': fileSourceInput,
                    });

        } else
        {
            self.sendFile(file, fileNameInput, progressBar);
        }



    });
    if (isSerialSending) {
        this.sendStackFileItem();
    } else {
        fileSourceInput.disabled = false;
    }
}

f00x.swap.prototype.sendStackFileItem = function ()
{
    current = this.stackAboutFiles[0];
    if (current instanceof Object)
    {

        this.stackAboutFiles.splice(0, 1);
        var isNotLast = (this.stackAboutFiles[0] ? true : false);
        this.sendFile(current.file, current.fileNameInput, current.progressBar, isNotLast);

        if (!isNotLast) {
            current.fileSourceInput.disabled = false;
        }
        return true

    } else {
        return false;

    }
}
f00x.swap.prototype.getStringGET = function (obj, url)
{
    if (!obj instanceof Object)
        return url;
    obj = obj || {};
    url = url || '';
    var res = '';
    var startlink = url.indexOf('#')
    while (startlink !== -1)
    {
        var nextAmp = url.indexOf('&', startlink);

        if (nextAmp == -1) {
            url = url.substr(0, startlink);
        } else
        {
            var nextAmp = url.substr(nextAmp);
            url = url.substr(0, startlink) + nextAmp;
        }
        startlink = url.indexOf('#');
    }
    if (url.indexOf('?') == -1)
    {
        res += '?';
    } else if (url.slice(-1) != '&')
    {
        res += '&';
    }
    for (var key in obj)
    {
        if (obj[key] == '') {
            res += key + '&';
        } else {
            res += key + '=' + encodeURI(obj[key]) + '&';
        }
    }
    res = url + res.slice(0, -1);
    return res

}
f00x.swap.prototype.getObjGET = function (url)
{
    var startget = url.indexOf('?')

    if (startget == -1)
        return {};
    url = url.slice(startget + 1);

    var startlink = url.indexOf('#')
    while (startlink !== -1)
    {
        var nextAmp = url.indexOf('&', startlink);

        if (nextAmp == -1) {
            url = url.substr(0, startlink);
        } else
        {
            var nextAmp = url.substr(nextAmp);
            url = url.substr(0, startlink) + nextAmp;
        }
        startlink = url.indexOf('#');
    }


    var arr = url.split('&');
    var res = {}
    for (var key in arr)
    {
        if (!isFinite(key))
            break;
        var $equally = arr[key].indexOf('=');
        if ($equally == -1) {
            res[arr[key]] = '';
            continue;
        }

        var $key = arr[key].substr(0, $equally);
        res[$key] = arr[key].substr($equally + 1);
    }
    return res;

}
f00x.progressBar = function () {
    this.createElement();
    return this;
};
f00x.progressBar.prototype.currentValue = 0;
f00x.progressBar.prototype.totalValue = 100;
f00x.progressBar.prototype.percent = 0;
f00x.progressBar.prototype.rootDivElement = false;
f00x.progressBar.prototype.lineDivElement = false;
f00x.progressBar.prototype.lineCaseDivElement = false;
f00x.progressBar.prototype.nameDivElement = false;
f00x.progressBar.prototype.messageDivElement = false;

f00x.progressBar.prototype.setMessage = function (msgValue)
{
    this.messageDivElement.innerHTML = msgValue
}

f00x.progressBar.prototype.setName = function (nameValue)
{
    this.nameDivElement.innerHTML = nameValue
}

f00x.progressBar.prototype.setTotalValue = function (newValue)
{
    this.totalValue = newValue;
    this.setPercent(this.calcPercent());
};
f00x.progressBar.prototype.setCurrentValue = function (newValue)
{
    this.currentValue = newValue;
    this.setPercent(this.calcPercent());
};
f00x.progressBar.prototype.setPercent = function (newValue)
{
    this.percent = newValue;
    if (this.lineDivElement instanceof Element) {
        this.lineDivElement.setAttribute('aria-valuenow', this.percent);
        this.lineDivElement.style.width = this.percent + "%";
        this.lineDivElement.innerHTML = this.percent + "%";
    }
}
f00x.progressBar.prototype.calcPercent = function ()
{
    if (this.currentValue && this.totalValue) {
        return ((parseInt(this.currentValue) / parseInt(this.totalValue)) * 100).toFixed();
    } else {
        return 0;
    }


};
f00x.progressBar.prototype.createElement = function ()
{

    this.rootDivElement = document.createElement('div');

    this.rootDivElement.classList.add("progress_bar_item", 'container', "alert", "alert-info");
    this.nameDivElement = document.createElement('div');
    this.nameDivElement.classList.add('bar_name')

    this.lineCaseDivElement = document.createElement('div');
    this.lineCaseDivElement.classList.add('line_case')
    this.lineCaseDivElement.classList.add('progress')

    this.lineDivElement = document.createElement('div');
    this.lineDivElement.classList.add('line')
    this.lineDivElement.classList.add('progress-bar')

    this.lineDivElement.style.width = this.percent + '%';
    this.lineDivElement.setAttribute('aria-valuenow', this.percent);
    this.lineDivElement.setAttribute('aria-valuemin', '0');
    this.lineDivElement.setAttribute('aria-valuemax', '100');


    this.lineCaseDivElement.appendChild(this.lineDivElement);

    this.resultDivElement = document.createElement('div');
    this.lineDivElement.classList.add('b_result')

    this.messageDivElement = document.createElement('div');

    this.rootDivElement.appendChild(this.nameDivElement);
    this.rootDivElement.appendChild(this.lineCaseDivElement);
    this.rootDivElement.appendChild(this.resultDivElement);
    this.rootDivElement.appendChild(this.messageDivElement);
    return this.rootDivElement;
};

f00x.event = function (name, self)
{
    this.name = name;
    this.scopeCall = self;
    this.listAction = []; 
}
f00x.event.prototype.name=false;
f00x.event.prototype.listAction = false;
f00x.event.prototype.scopeCall = false;
f00x.event.prototype.addAction = function (Action) {
    if (Action instanceof Function) {
        this.listAction.push(Action);
        return true;
    }
    return false;
}
f00x.event.prototype.call = function () {
    for (var key in this.listAction)
    {
        var Action = this.listAction[key];

        if (Action instanceof Function)
        {
            Action.apply(this.scopeCall, arguments);
        }
    }
}

f00x.scroll = {};
f00x.scroll.vertical = {};
f00x.scroll.vertical.toTop = function ()
{
    this.userLevelScroll = this.getScroll();
    //scrollTo(0,document.body.scrollLeft) = 0;
    this.setScroll(0);
}
f00x.scroll.vertical.toBottomLevel = function ()
{
    if (this.userLevelScroll > 0)
    {
        if (this.getScroll() >= this.userLevelScroll)
            this.toBottom();
        else
            this.setScroll(this.userLevelScroll);
    } else
        this.toBottom();
}
f00x.scroll.vertical.toBottom = function ()
{ //alert('toBottom')
    this.setScroll(this.getHeight());

}
f00x.scroll.vertical.getHeight = function ()
{
    var scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
            );
    return scrollHeight;
}
f00x.scroll.vertical.getScroll = function ()
{
    return window.pageYOffset || document.documentElement.scrollTop;
}
f00x.scroll.vertical.setScroll = function (value)
{
    window.scrollTo(f00x.scroll.horisontal.getScroll(),value)
}
f00x.scroll.horisontal = {};
f00x.scroll.horisontal.getScroll=function()
{
    return window.pageXOffset || document.documentElement.scrollLeft;
}
f00x.scroll.horisontal.setScroll = function (value)
{
    window.scrollTo(value,f00x.scroll.vertical.getScroll())
}

