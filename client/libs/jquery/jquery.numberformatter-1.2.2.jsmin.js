
(function(jQuery){var nfLocales=new Hashtable();var nfLocalesLikeUS=['ae','au','ca','cn','eg','gb','hk','il','in','jp','sk','th','tw','us'];var nfLocalesLikeDE=['at','br','de','dk','es','gr','it','nl','pt','tr','vn'];var nfLocalesLikeFR=['cz','fi','fr','ru','se','pl'];var nfLocalesLikeCH=['ch'];var nfLocaleFormatting=[[".",","],[",","."],[","," "],[".","'"]];var nfAllLocales=[nfLocalesLikeUS,nfLocalesLikeDE,nfLocalesLikeFR,nfLocalesLikeCH]
function FormatData(dec,group,neg){this.dec=dec;this.group=group;this.neg=neg;};function init(){for(var localeGroupIdx=0;localeGroupIdx<nfAllLocales.length;localeGroupIdx++){localeGroup=nfAllLocales[localeGroupIdx];for(var i=0;i<localeGroup.length;i++){nfLocales.put(localeGroup[i],localeGroupIdx);}}};function formatCodes(locale){if(nfLocales.size()==0)
init();var dec=".";var group=",";var neg="-";var codesIndex=nfLocales.get(locale);if(codesIndex){var codes=nfLocaleFormatting[codesIndex];if(codes){dec=codes[0];group=codes[1];}}
return new FormatData(dec,group,neg);};jQuery.fn.formatNumber=function(options,writeBack,giveReturnValue){return this.each(function(){if(writeBack==null)
writeBack=true;if(giveReturnValue==null)
giveReturnValue=true;var text;if(jQuery(this).is(":input"))
text=new String(jQuery(this).val());else
text=new String(jQuery(this).text());var returnString=jQuery.formatNumber(text,options);if(writeBack){if(jQuery(this).is(":input"))
jQuery(this).val(returnString);else
jQuery(this).text(returnString);}
if(giveReturnValue)
return returnString;});};jQuery.formatNumber=function(numberString,options){var options=jQuery.extend({},jQuery.fn.formatNumber.defaults,options);var formatData=formatCodes(options.locale.toLowerCase());var dec=formatData.dec;var group=formatData.group;var neg=formatData.neg;var validFormat="0#-,.";var prefix="";var negativeInFront=false;for(var i=0;i<options.format.length;i++){if(validFormat.indexOf(options.format.charAt(i))==-1)
prefix=prefix+options.format.charAt(i);else
if(i==0&&options.format.charAt(i)=='-'){negativeInFront=true;continue;}
else
break;}
var suffix="";for(var i=options.format.length-1;i>=0;i--){if(validFormat.indexOf(options.format.charAt(i))==-1)
suffix=options.format.charAt(i)+suffix;else
break;}
options.format=options.format.substring(prefix.length);options.format=options.format.substring(0,options.format.length-suffix.length);var number=new Number(numberString);return jQuery._formatNumber(number,options,suffix,prefix,negativeInFront);};jQuery._formatNumber=function(number,options,suffix,prefix,negativeInFront){var options=jQuery.extend({},jQuery.fn.formatNumber.defaults,options);var formatData=formatCodes(options.locale.toLowerCase());var dec=formatData.dec;var group=formatData.group;var neg=formatData.neg;var forcedToZero=false;if(isNaN(number)){if(options.nanForceZero==true){number=0;forcedToZero=true;}else
return null;}
if(suffix=="%")
number=number*100;var returnString="";if(options.format.indexOf(".")>-1){var decimalPortion=dec;var decimalFormat=options.format.substring(options.format.lastIndexOf(".")+1);if(options.round==true)
number=new Number(number.toFixed(decimalFormat.length));else{var numStr=number.toString();numStr=numStr.substring(0,numStr.lastIndexOf('.')+decimalFormat.length+1);number=new Number(numStr);}
var decimalValue=number%1;var decimalString=new String(decimalValue.toFixed(decimalFormat.length));decimalString=decimalString.substring(decimalString.lastIndexOf(".")+1);for(var i=0;i<decimalFormat.length;i++){if(decimalFormat.charAt(i)=='#'&&decimalString.charAt(i)!='0'){decimalPortion+=decimalString.charAt(i);continue;}else if(decimalFormat.charAt(i)=='#'&&decimalString.charAt(i)=='0'){var notParsed=decimalString.substring(i);if(notParsed.match('[1-9]')){decimalPortion+=decimalString.charAt(i);continue;}else
break;}else if(decimalFormat.charAt(i)=="0")
decimalPortion+=decimalString.charAt(i);}
returnString+=decimalPortion}else
number=Math.round(number);var ones=Math.floor(number);if(number<0)
ones=Math.ceil(number);var onesFormat="";if(options.format.indexOf(".")==-1)
onesFormat=options.format;else
onesFormat=options.format.substring(0,options.format.indexOf("."));var onePortion="";if(!(ones==0&&onesFormat.substr(onesFormat.length-1)=='#')||forcedToZero){var oneText=new String(Math.abs(ones));var groupLength=9999;if(onesFormat.lastIndexOf(",")!=-1)
groupLength=onesFormat.length-onesFormat.lastIndexOf(",")-1;var groupCount=0;for(var i=oneText.length-1;i>-1;i--){onePortion=oneText.charAt(i)+onePortion;groupCount++;if(groupCount==groupLength&&i!=0){onePortion=group+onePortion;groupCount=0;}}
if(onesFormat.length>onePortion.length){var padStart=onesFormat.indexOf('0');if(padStart!=-1){var padLen=onesFormat.length-padStart;while(onePortion.length<padLen){onePortion='0'+onePortion;}}}}
if(!onePortion&&onesFormat.indexOf('0',onesFormat.length-1)!==-1)
onePortion='0';returnString=onePortion+returnString;if(number<0&&negativeInFront&&prefix.length>0)
prefix=neg+prefix;else if(number<0)
returnString=neg+returnString;if(!options.decimalSeparatorAlwaysShown){if(returnString.lastIndexOf(dec)==returnString.length-1){returnString=returnString.substring(0,returnString.length-1);}}
returnString=prefix+returnString+suffix;return returnString;};jQuery.fn.parseNumber=function(options,writeBack,giveReturnValue){if(writeBack==null)
writeBack=true;if(giveReturnValue==null)
giveReturnValue=true;var text;if(jQuery(this).is(":input"))
text=new String(jQuery(this).val());else
text=new String(jQuery(this).text());var number=jQuery.parseNumber(text,options);if(number){if(writeBack){if(jQuery(this).is(":input"))
jQuery(this).val(number.toString());else
jQuery(this).text(number.toString());}
if(giveReturnValue)
return number;}};jQuery.parseNumber=function(numberString,options){var options=jQuery.extend({},jQuery.fn.parseNumber.defaults,options);var formatData=formatCodes(options.locale.toLowerCase());var dec=formatData.dec;var group=formatData.group;var neg=formatData.neg;var valid="1234567890.-";while(numberString.indexOf(group)>-1)
numberString=numberString.replace(group,'');numberString=numberString.replace(dec,".").replace(neg,"-");var validText="";var hasPercent=false;if(numberString.charAt(numberString.length-1)=="%")
hasPercent=true;for(var i=0;i<numberString.length;i++){if(valid.indexOf(numberString.charAt(i))>-1)
validText=validText+numberString.charAt(i);}
var number=new Number(validText);if(hasPercent){number=number/100;number=number.toFixed(validText.length-1);}
return number;};jQuery.fn.parseNumber.defaults={locale:"us",decimalSeparatorAlwaysShown:false};jQuery.fn.formatNumber.defaults={format:"#,###.00",locale:"us",decimalSeparatorAlwaysShown:false,nanForceZero:true,round:true};Number.prototype.toFixed=function(precision){return $._roundNumber(this,precision);};jQuery._roundNumber=function(number,decimalPlaces){var power=Math.pow(10,decimalPlaces||0);var value=String(Math.round(number*power)/power);if(decimalPlaces>0){var dp=value.indexOf(".");if(dp==-1){value+='.';dp=0;}else{dp=value.length-(dp+1);}
while(dp<decimalPlaces){value+='0';dp++;}}
return value;};})(jQuery);