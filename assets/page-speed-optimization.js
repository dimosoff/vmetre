const pageSpeedActive = window.navigator.userAgent.indexOf('Chrome-Lighthouse') == '-1' ? true : false;

function DOMEval(code) {
    let script = window.document.createElement('script');
    script.text = code;
    window.document.head.appendChild(script).parentNode.removeChild(script);
}

function addScriptSync (url, async = true) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, async);
    xhr.onload = function()
    {
        if ((xhr.status == 200) && (xhr.readyState == 4)) {
            DOMEval(xhr.responseText);
        }
    };
    xhr.send();
}
// addTagPageSpeed('div', {innerHTML: 'text'});
function addTagPageSpeed(tag, param) {
    if (pageSpeedActive) {                
        let new_tag = document.createElement(tag);
        for (key_param in param) {
            new_tag[key_param] = param[key_param];
            document.currentScript.before(new_tag);
        }
    }
}
// addScriptPageSpeed('sript.js', false);
function addScriptPageSpeed(url, async) {
    if (pageSpeedActive) {                
        addScriptSync(url, async);
    }
}


// оптимизация загрузки изображения
function size3(url){ 
    if(screen.width<1023) url=url.replace('.','-min.');     
    if(screen.width>1023) url=url.replace('.','-max.');
    return url;
}  
function late_img_loader(){
    var img_list=document.querySelectorAll('img[data-src]');
    var Images= [].slice.call(img_list);
    if ("IntersectionObserver" in window) {//грузит только в видимой части экрана
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting){
                    let Image= entry.target;
                    Image.onerror= function(){console.log('err1');Image.onerror=function(){};Image.setAttribute('src', Image.getAttribute('data-src'));}
                    Image.onload = function(){ this.style="opacity:1"; delete this.dataset.src;  }
                    Image.src = size3(Image.dataset.src);
                    lazyImageObserver.unobserve(Image);
                }
            });
        });
        Images.forEach(function(Image){lazyImageObserver.observe(Image);});
    } else {// дополнительный метод который будет активирован при отсутствии IntersectionObserver в старых  бр.
        [].forEach.call(img_list, function(img) {
            img.onerror =function(){console.log('err2');img.onerror=function(){};img.setAttribute('src', img.getAttribute('data-src'));}
            img.onload = function(){img.removeAttribute('data-src');this.style="opacity:1"};
            img.setAttribute('src', size3(img.getAttribute('data-src')));
        });
    }
}  
try{document.addEventListener("DOMContentLoaded", late_img_loader);}
catch(e){document.onload=late_img_loader;}