(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";exports.__esModule=true;exports.formatValue=formatValue;exports.formatQuantity=formatQuantity;exports.getValueColor=getValueColor;exports.getStockPriceColor=getStockPriceColor;function formatValue(value,precision){precision=precision||1;if(typeof value==="number"&&!isNaN(value)){return value.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g,",")}else{return"-"}}function formatQuantity(quantity){var tmp=formatValue(quantity,0);if(tmp==="-"){return tmp}else{var len=tmp.length;return tmp.substring(0,len-3)}}function getValueColor(value,base,ceiling,bottom){var direction;if(value===ceiling){direction="ceiling"}else if(value<base){direction="down"}else if(value===bottom){direction="bottom"}else if(value>base){direction="inc"}else{direction="equal"}return"vsw-"+direction}function getStockPriceColor(price,stockInfo){var basicPrice=stockInfo.basicPrice;var ceilingPrice=stockInfo.ceilingPrice;var floorPrice=stockInfo.floorPrice;return getValueColor(price,basicPrice,ceilingPrice,floorPrice)}},{}],2:[function(require,module,exports){"use strict";require("../style.css");var _require=require("./format");var getValueColor=_require.getValueColor;var getStockPriceColor=_require.getStockPriceColor;var formatValue=_require.formatValue;var formatQuantity=_require.formatQuantity;var _require2=require("./utils");var ajax=_require2.ajax;var PRICE_SERVICE="//priceservice.vndirect.com.vn";var FloorCodes={HNX:"02",HOSE:"10",UPCOME:"03",VN30:"11",HNX30:"12"};function getStatusKey(marketInfo){var status=marketInfo.status;var floorCode=marketInfo.floorCode;var vStatus;switch(status){case"O":case"5":vStatus="continuous";break;case"P":case"2":if(floorCode==FloorCodes.HOSE||floorCode==FloorCodes.VN30){vStatus="ato"}else{vStatus="closed"}break;case"A":case"9":case"30":vStatus="atc";break;case"C":case"0":case"35":vStatus="putThrough";break;case"I":case"BSU":case"3":case"10":vStatus="intermission";break;default:vStatus="closed"}return vStatus}function formatMarketStatusText(marketInfo){var mapping={ato:"ATO",continuous:"Liên tục",intermission:"Nghỉ trưa",atc:"ATC",putThrough:"GDTT",closed:"Đóng cửa"};return mapping[getStatusKey(marketInfo)]}function getMarketInfo(floorCode,callback){ajax(PRICE_SERVICE+"/priceservice/market/snapshot/q=codes:"+floorCode,"GET",function(error,data){if(!error){callback(null,data[floorCode].data)}else{console.log(error)}})}function getStockInfo(stockCode,callback){ajax(PRICE_SERVICE+"/priceservice/secinfo/snapshot/q=codes:"+stockCode,"GET",function(error,data){if(error){callback(error)}else{var arr=data[0].split("|");callback(null,{floorCode:arr[0],tradingDate:arr[1],time:arr[2],code:arr[3],companyName:arr[4],stockType:arr[5],totalRoom:parseInt(arr[6]),currentRoom:parseInt(arr[7]),basicPrice:parseFloat(arr[8]),openPrice:parseFloat(arr[9]),closePrice:parseFloat(arr[10]),currentPrice:parseFloat(arr[11]),currentQtty:parseInt(arr[12]),highestPrice:parseFloat(arr[13]),lowestPrice:parseFloat(arr[14]),ceilingPrice:parseFloat(arr[15]),floorPrice:parseFloat(arr[16]),totalOfferQtty:parseInt(arr[17]),totalBidQtty:parseInt(arr[18]),matchPrice:parseFloat(arr[19]),matchQtty:parseInt(arr[20]),matchValue:parseInt(arr[21]),averagePrice:parseFloat(arr[22]),bidPrice01:parseFloat(arr[23]),bidQtty01:parseInt(arr[24]),bidPrice02:parseFloat(arr[25]),bidQtty02:parseInt(arr[26]),bidPrice03:parseFloat(arr[27]),bidQtty03:parseInt(arr[28]),offerPrice01:parseFloat(arr[29]),offerQtty01:parseInt(arr[30]),offerPrice02:parseFloat(arr[31]),offerQtty02:parseInt(arr[32]),offerPrice03:parseFloat(arr[33]),offerQtty03:parseInt(arr[34]),accumulatedVal:parseFloat(arr[35]),accumulatedVol:parseFloat(arr[36]),buyForeignQtty:parseInt(arr[37]),sellForeignQtty:parseInt(arr[38]),projectOpen:parseFloat(arr[39]),sequence:arr[40]})}})}function render(stockInfo,marketInfo,displayMode){var basicPrice=stockInfo.basicPrice;var matchPrice=stockInfo.matchPrice;var highestPrice=stockInfo.highestPrice;var lowestPrice=stockInfo.lowestPrice;var floorPrice=stockInfo.floorPrice;var accumulatedVal=stockInfo.accumulatedVal;var accumulatedVol=stockInfo.accumulatedVol;var code=stockInfo.code;var marketStatus=formatMarketStatusText(marketInfo);if(accumulatedVal>=1){var averagePrice=parseFloat((accumulatedVal/accumulatedVol*1e5).toFixed(1))}else{var averagePrice=NaN}var priceDelta=matchPrice-basicPrice;var priceDeltaPercent=priceDelta/basicPrice*100;var now=new Date;var date=now.getDate(),month=now.getMonth(),year=now.getFullYear(),hour=now.getHours(),min=now.getMinutes();var renderTime=date+"/"+month+"/"+year+" "+hour+":"+min;var duMua=NaN,duBan=NaN;if(stockInfo.floorCode===FloorCodes.HNX){var duMua=stockInfo.totalBidQtty-stockInfo.accumulatedVol;var duBan=stockInfo.totalOfferQtty-stockInfo.accumulatedVol}var overview='\n    <div>\n        <div class="vsw-current-price '+getStockPriceColor(matchPrice,stockInfo)+'"\n             title="Giá khớp lệnh">\n            '+formatValue(matchPrice)+'\n        </div>\n\n        <div>\n            <div class="vsw-symbol '+getStockPriceColor(matchPrice,stockInfo)+'">\n                <a href="https://www.vndirect.com.vn/portal/tong-quan/'+code+'.shtml" target="_blank">\n                    '+code+'\n                </a>\n            </div>\n\n            <div class="vsw-percentage '+getStockPriceColor(matchPrice,stockInfo)+'"\n                 title="Chênh lệnh giữa giá khớp và giá tham chiếu">\n                '+formatValue(priceDelta)+" ("+(priceDeltaPercent>0?"+":"")+formatValue(priceDeltaPercent,2)+'%)\n            </div>\n        </div>\n\n        <div>\n            <div class="vsw-direction '+getStockPriceColor(matchPrice,stockInfo)+'-icon"></div>\n            <div class="vsw-acc-volume">\n                <span>Tổng KLGD:</span>\n                <span class="vsw-value">\n                    '+formatQuantity(accumulatedVol*10)+"\n                </span>\n            </div>\n        </div>\n    </div>\n    ";var copyright='\n    <div>\n        <a class="vsw-copyright" href="https://www.vndirect.com.vn/" target="_blank">\n            Bản quyền © <img src="logo.png" alt="VNDIRECT" />\n        </a>\n    </div>\n    ';var template='\n    <div class="vsw-widget">\n        '+overview+'\n\n        <div>\n            <div class="vsw-highest-price">\n                <span class="vsw-label">Cao nhất</span>\n                <span class="vsw-value '+getStockPriceColor(highestPrice,stockInfo)+'">\n                    '+formatValue(highestPrice)+'\n                </span>\n            </div>\n            <div class="vsw-average-price">\n                <span class="vsw-label">Trung bình</span>\n                <span class="vsw-value '+getStockPriceColor(averagePrice,stockInfo)+'">\n                    '+formatValue(averagePrice)+'\n                </span>\n            </div>\n            <div class="vsw-lowest-price">\n                <span class="vsw-label">Thấp nhất</span>\n                <span class="vsw-value '+getStockPriceColor(lowestPrice,stockInfo)+'">\n                    '+formatValue(lowestPrice)+'\n                </span>\n            </div>\n        </div>\n\n        <div class="vsw-du-mua-du-ban">\n            <div class="vsw-du-mua">\n                <span>Dư mua:</span>\n                <span class="vsw-inc">'+formatQuantity(duMua*10)+'</span>\n            </div>\n            <div class="vsw-du-ban">\n                <span>Dư bán:</span>\n                <span class="vsw-down">'+formatQuantity(duBan*10)+'</span>\n            </div>\n        </div>\n\n        <div class="vsw-meta-info">\n            <div class="vsw-market-status">\n                <span>Phiên giao dịch:</span> <span class="vsw-value">'+marketStatus+'</span>\n            </div>\n            <div class="vsw-update-time">\n                <span>Thời điểm cập nhật:</span>\n                <span class="vsw-value">'+renderTime+"</span>\n            </div>\n        </div>\n\n        "+copyright+"\n    </div>\n    ";var compactTemplate='\n        <div class="vsw-widget vsw-widget-compact">\n            '+overview+"\n            "+copyright+"\n        </div>\n    ";return displayMode==="compact"?compactTemplate:template}function setup(element){var stockSymbol=element.getAttribute("data-symbol").toUpperCase();var displayMode=element.getAttribute("data-display-mode");var rerender=function rerender(){getStockInfo(stockSymbol,function(error,stockInfo){error&&console.error("Cannot get stock info",error);getMarketInfo(stockInfo.floorCode,function(error,marketInfo){error&&console.error("Cannot get market info",error);element.innerHTML=render(stockInfo,marketInfo,displayMode)})})};element.innerHTML='\n    <div class="vsw-widget">\n        Đang tải...\n    </div>\n    ';rerender();setInterval(rerender,30*1e3)}var elements=document.querySelectorAll("[data-stock-widget]");for(var i=0;i<elements.length;i++){setup(elements[i])}},{"../style.css":4,"./format":1,"./utils":3}],3:[function(require,module,exports){"use strict";exports.__esModule=true;exports.ajax=ajax;function ajax(url,method,callback){var xhr=new XMLHttpRequest;if("withCredentials"in xhr){xhr.open(method,url,true)}else if(typeof XDomainRequest!="undefined"){xhr=new XDomainRequest;xhr.open(method,url)}else{callback("CORS not supported")}xhr.onload=function(){callback(null,JSON.parse(xhr.responseText))};xhr.onerror=function(error){callback(error)};setTimeout(function(){xhr.send()},0)}},{}],4:[function(require,module,exports){var css='.vsw-equal{color:#ffae01}.vsw-down{color:#d21801}.vsw-inc{color:green}.vsw-ceiling{color:#af169f}.vsw-bottom{color:#6CF}.vsw-equal-icon:after{color:#ffae01;content:"—";font-weight:700;height:1em}.vsw-down-icon:after{color:#d21801;content:"▼";height:1em}.vsw-inc-icon:after{color:green;content:"▲";height:1em}.vsw-ceiling-icon:after{color:#af169f;content:"▲";height:1em}.vsw-bottom-icon:after{color:#6CF;content:"▼";height:1em}.vsw-widget{border:1px solid #DCDCDC;border-radius:5px;padding:15px;color:gray;font-family:Arial,sans-serif;font-size:13px;background-color:#fff}.vsw-widget>div:after{content:"";display:table;clear:both}.vsw-widget>div{padding-bottom:1em}.vsw-widget.vsw-widget-compact>div,.vsw-widget>div:last-child{padding-bottom:0}.vsw-percentage{text-align:right}.vsw-current-price,.vsw-symbol{margin-right:5px}.vsw-current-price{font-weight:700;font-size:2.5em;float:left}.vsw-symbol{float:left}.vsw-symbol>a{text-decoration:none;color:inherit}.vsw-average-price,.vsw-highest-price,.vsw-lowest-price{float:left;width:33.3%}.vsw-average-price>.vsw-value,.vsw-highest-price>.vsw-value,.vsw-lowest-price>.vsw-value{font-size:1.5em;font-weight:700}.vsw-average-price>.vsw-label,.vsw-highest-price>.vsw-label,.vsw-lowest-price>.vsw-label{display:block}.vsw-du-mua-du-ban{border-bottom:1px dotted #DCDCDC;margin-bottom:1em}.vsw-du-ban,.vsw-du-mua{float:left;width:50%}.vsw-market-status .vsw-value{color:#f39200;font-weight:700}.vsw-update-time .vsw-value{color:#333}.vsw-acc-volume{float:right}.vsw-direction{float:left}.vsw-acc-volume .vsw-value{color:#333;font-weight:700}.vsw-meta-info .vsw-value{float:right}.vsw-meta-info>div:not(:last-child){margin-bottom:.5em}a.vsw-copyright{float:right;text-decoration:none;font-size:.6em;color:inherit;margin-bottom:-.5em}.vsw-copyright img{height:1em;vertical-align:middle}';require("browserify-css").createStyle(css,{href:".tmp/style.css"});module.exports=css},{"browserify-css":5}],5:[function(require,module,exports){"use strict";module.exports={createLink:function(href,attributes){var head=document.head||document.getElementsByTagName("head")[0];var link=document.createElement("link");link.href=href;link.rel="stylesheet";for(var key in attributes){if(!attributes.hasOwnProperty(key)){continue}var value=attributes[key];link.setAttribute("data-"+key,value)}head.appendChild(link)},createStyle:function(cssText,attributes){var head=document.head||document.getElementsByTagName("head")[0],style=document.createElement("style");style.type="text/css";for(var key in attributes){if(!attributes.hasOwnProperty(key)){continue}var value=attributes[key];style.setAttribute("data-"+key,value)}if(style.sheet){style.innerHTML=cssText;style.sheet.cssText=cssText;head.appendChild(style)}else if(style.styleSheet){head.appendChild(style);style.styleSheet.cssText=cssText}else{style.appendChild(document.createTextNode(cssText));head.appendChild(style)}}}},{}]},{},[2]);