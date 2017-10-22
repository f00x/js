 f00x = (typeof (f00x) != "undefined" && f00x instanceof Object) ? f00x : {};
f00x.TimeSelectField=function(elementSelectHour,elementSelectMinute){
     this.ElementHour=elementSelectHour;
     this.ElementMinute=elementSelectMinute;
 }
 f00x.TimeSelectField.prototype.ElementHour=false;
 f00x.TimeSelectField.prototype.ElementMinute=false;
 f00x.TimeSelectField.prototype.getText = function()
 {var hour=this.getOptionTextInSelect(this.ElementHour);
   var minute=  this.getOptionTextInSelect(this.ElementMinute);
   return hour+':'+minute;
 } 
 
 f00x.TimeSelectField.prototype.getOptionTextInSelect=function(ElementSelect)
 {var value=ElementSelect.value;
     
     var option=  ElementSelect.querySelector('option[value="'+value+'"]');
     return option.innerHTML;
     
 }


