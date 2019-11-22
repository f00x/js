f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};

f00x.AutoSave = function (form, intervalSecond, root_box) {
    this.eventBeforeSave = new f00x.event('BeforeSave') ;
    this.intervalSecond = intervalSecond || this.intervalSecond;

    if (root_box instanceof Element) {
        this.root_box = root_box;
    } else {
        this.root_box = document.querySelector('body');
    }
    this.form = form;
    this.initHtmlElement();
    this.timer = new f00x.TimerElement(this.monitor_timer, 1, "%h:%i:%s")
    this.start();

}
f00x.AutoSave.prototype.eventBeforeSave=false;
f00x.AutoSave.prototype.form = false;
f00x.AutoSave.prototype.timer = false;
f00x.AutoSave.prototype.intervalSecond = 300;

f00x.AutoSave.prototype.initHtmlElement = function(){
    this.monitor_msg_box=document.createElement('div');
    this.root_box.insertBefore(this.monitor_msg_box,  this.root_box.firstChild);
    this.monitor_msg_box.classList.add('auto_save_monitor_msg_box')
    this.monitor_box = document.createElement('div');
    this.root_box.insertBefore(this.monitor_box,this.monitor_msg_box);
    this.monitor_box.classList.add('auto_save_monitor_box')

    this.button_save = document.createElement('div');
    this.button_save.classList.add('auto_save_btn', 'auto_save_btn_save')
    let self=this
    this.button_save.addEventListener('click', function(){ self.saveForm()})

    this.button_pause_play = document.createElement('div');
    this.button_pause_play.classList.add('auto_save_btn', 'auto_save_btn_pause')

    this.monitor_box.appendChild(this.button_save);
    var monitor_label = document.createElement('b');
    monitor_label.innerText = 'Автосохранение через:'
    this.monitor_box.appendChild(monitor_label)
    this.monitor_timer = document.createElement('div');
    this.monitor_timer.classList.add('auto_save_monitor_timer')
    this.monitor_box.appendChild(this.monitor_timer);
    this.monitor_box.appendChild(this.button_pause_play);
    var saveDateTime = new Date(new Date().getTime() + this.intervalSecond * 1000)
    this.monitor_timer.setAttribute('data-time-finish', saveDateTime.toGMTString());


}
f00x.AutoSave.prototype.root_box = false;
f00x.AutoSave.prototype.monitor_msg_box = false;
f00x.AutoSave.prototype.monitor_box = false;
f00x.AutoSave.prototype.button_save = false;
f00x.AutoSave.prototype.button_pause_play = false;
f00x.AutoSave.prototype.monitor_timer = false;

f00x.AutoSave.prototype.start = function () {
    let self=this
    this.intervalId = setInterval(function () {
        self.iterableAction()
    }, this.intervalSecond * 1000);
    var saveDateTime = new Date(new Date().getTime() + this.intervalSecond * 1000)
    this.timer.DateTimeFinish = saveDateTime;
    this.button_pause_play.classList.remove('auto_save_btn_play');
    this.button_pause_play.classList.add('auto_save_btn_pause');
    this.changeClickEvent(this.button_pause_play,function(){ self.stop()})
}
f00x.AutoSave.prototype.intervalId = false;
f00x.AutoSave.prototype.stop = function () {
    clearInterval(this.intervalId);
    this.timer.DateTimeFinish = new Date();
    this.button_pause_play.classList.remove('auto_save_btn_pause');
    this.button_pause_play.classList.add('auto_save_btn_play');
    let self=this
    this.changeClickEvent(this.button_pause_play,function(){ self.start()})
}
f00x.AutoSave.prototype.changeClickEvent=function(element,callback){
    if(element instanceof Element) {
        if (element.memory_click_event) {
            element.removeEventListener('click', element.memory_click_event);
        }
        element.memory_click_event=callback;
        element.addEventListener('click', callback);
    }
}
f00x.AutoSave.prototype.iterableAction = function () {
    var saveDateTime = new Date(new Date().getTime() + this.intervalSecond * 1000)
    this.saveForm(this.form)
    this.timer.DateTimeFinish = saveDateTime;
}
f00x.AutoSave.prototype.saveForm = function () {
    this.eventBeforeSave.call();
    this.button_save.classList.add('auto_save_disabled');
    this.changeClickEvent(this.button_save,function(){});
    let formData = new FormData(this.form);
    console.log(formData);
    let swap = new f00x.swap();
    swap.url = this.form.action;
    let self=this
    swap.eventLoadEnd.addAction(function(){self.printSave(this)});
    swap.sendPostFromFormData(formData);
}
f00x.AutoSave.prototype.printSave = function (response) {

    let self=this
    this.changeClickEvent(this.button_save,function(){ self.saveForm()});
    this.button_save.classList.remove('auto_save_disabled');

    let elementMsg = document.createElement('div');
    this.monitor_msg_box.appendChild(elementMsg);
    elementMsg.classList.add('auto_save_monitor_msg', 'auto_save_monitor_msg_on')
    var timerId1 = setTimeout(function () {
        elementMsg.classList.remove('auto_save_monitor_msg_on');
        elementMsg.classList.add('auto_save_monitor_msg_off');
    }, this.msg_dalay_second_off * 1000)
    var timerId = setTimeout(function () {
        self.monitor_msg_box.removeChild(elementMsg)
    }, this.msg_dalay_second_delete * 1000)
    if (response.status == 200) {
        elementMsg.classList.add('auto_save_monitor_msg_ok');
        elementMsg.innerText = 'Сохранено';
    } else {
        console.error('auto save statusHTTP-' + response.status);
        console.log(response);
        console.log('====================');
        elementMsg.classList.add('auto_save_monitor_msg_error');
        elementMsg.innerText = 'Ошибка http-' + response.status;
    }
    console.log(this)
}
f00x.AutoSave.prototype.msg_dalay_second_off= 3;
f00x.AutoSave.prototype.msg_dalay_second_delete= 5;


