YUI.add("moodle-atto_recittakepicture-button",function(h,e){IMAGETEMPLATE='<a href="{{url}}" target="_blank"><img src="{{url}}" alt="{{alt}}" {{#if width}}width="{{width}}" {{/if}}{{#if height}}height="{{height}}" {{/if}}{{#if presentation}}role="presentation" {{/if}}{{#if customstyle}}style="{{customstyle}}" {{/if}}{{#if classlist}}class="{{classlist}}" {{/if}}{{#if id}}id="{{id}}" {{/if}}/></a>',TEMPLATE='<form id="atto_recittakepicture_dialogue" class="recittakepicture"><div class="camera" id="{{component}}camera"><div style="margin:auto"><video id="{{component}}video" autoplay playsinline></video><div class="livevideo-controls"><div class="video-options"><button class="btn btn-secondary" href="#"><i class="fab fa-rev"></i></button></div><button id="{{component}}startbutton" class="btn btn-secondary">{{get_string "takephoto" component}}</button></div></div></div><canvas id="{{component}}canvas" style="display:none"></canvas><div class="camoutput"><img id="{{component}}photo" width="{{width}}" height="{{height}}" alt="capture"><div class="video-controls"><button id="{{component}}startbutton2" class="btn btn-secondary">{{get_string "takephoto" component}}</button><button class="btn btn-secondary" id="{{component}}submit" disabled> {{get_string "saveimage" component}}</button></div></div></form>',COMPONENTNAME="atto_recittakepicture",h.namespace("M.atto_recittakepicture").Button=h.Base.create("button",h.M.editor_atto.EditorPlugin,[],{_currentSelection:null,_content:null,stream:null,accessGranted:!0,streamOptions:{video:{width:{min:64,ideal:1920},height:{min:40,ideal:1080}}},devices:[],cur_devices:0,shotBlob:"",initializer:function(){this.get("host").canShowFilepicker("media")&&(this.addButton({title:"takephoto",icon:"e/camera",iconComponent:COMPONENTNAME,callback:this.openCamera,buttonName:"takephoto"}),navigator.permissions.query({name:"camera"}).then(function(e){"prompt"==e&&(this.accessGranted=!1)}))},openCamera:function(){var i,n,o,a,s,e,t,r,d,c,l,u,p,m;if(!this.accessGranted)return h.use("moodle-core-notification-alert",function(){new M.core.alert({message:M.util.get_string("grantaccess",COMPONENTNAME)})}),void navigator.mediaDevices.getUserMedia({video:!0});i=this.getDialogue({headerContent:M.util.get_string("pluginname",COMPONENTNAME),focusAfterHide:!0,width:"auto",height:"auto"}),e=h.Handlebars.compile(TEMPLATE),t=h.Node.create(e({elementid:this.get("host").get("elementid"),component:COMPONENTNAME,width:.8*window.innerWidth,height:.8*window.innerHeight})),i.set("bodyContent",t).show(),n=document.getElementById(COMPONENTNAME+"camera"),o=document.getElementById(COMPONENTNAME+"video"),a=document.getElementById(COMPONENTNAME+"canvas"),s=document.getElementById(COMPONENTNAME+"photo"),e=document.getElementById(COMPONENTNAME+"startbutton"),t=document.getElementById(COMPONENTNAME+"startbutton2"),r=document.getElementById(COMPONENTNAME+"submit"),d=.7*window.innerWidth,c=.7*window.innerHeight,l=!1,u="",p=this,(m=a.getContext("2d")).fillStyle="#AAA",m.fillRect(0,0,a.width,a.height),u=a.toDataURL("image/png"),s.setAttribute("src",u),this.startStream(),s.parentElement.style.display="none",o.addEventListener("canplay",function(e){l||(c=o.videoHeight/(o.videoWidth/d),isNaN(c)&&(c=d/(4/3)),o.videoHeight>.8*window.innerHeight&&(c=.8*window.innerHeight,d=o.videoWidth/(o.videoHeight/c)),l=!0)},!1),e.addEventListener("click",function(e){if(e.preventDefault(),"none"===n.style.display)return n.style.display="block",s.parentElement.style.display="none",void(r.disabled=!0);if(n.style.display="none",s.parentElement.style.display="block",d&&c){if(a.width=o.videoWidth,a.height=o.videoHeight,m.drawImage(o,0,0,o.videoWidth,o.videoHeight),"undefined"!=typeof ImageCapture){e=o.srcObject.getVideoTracks()[0];const t=new ImageCapture(e);t.grabFrame().then(function(e){p.bmpToBlob(e,function(e){p.shotBlob=e})})}u=a.toDataURL("image/png"),s.setAttribute("src",u),s.removeAttribute("width"),s.removeAttribute("height"),r.disabled=!1,setTimeout(function(){i.centerDialogue()}.bind(p),500)}},!1),t.addEventListener("click",function(e){e.preventDefault(),n.style.display="block",s.parentElement.style.display="none",r.disabled=!0}),r.addEventListener("click",function(e){var t;e.preventDefault(),p.shotBlob?p._uploadImage(p.shotBlob):(e=(t=u.split(";"))[0].split(":")[1],t=t[1].split(",")[1],e=p.b64toBlob(t,e),p._uploadImage(e))},!1),this.loadCameraDevices(),this.initChangeDevice()},loadCameraDevices:function(){var i;"mediaDevices"in navigator&&navigator.mediaDevices.getUserMedia?(i=this,document.querySelector(".video-options>select"),navigator.mediaDevices.enumerateDevices().then(function(e){var t,e=e.filter(e=>"videoinput"===e.kind);0==e.length&&(document.querySelector(".video-options").style.display="none"),i.devices=[];for(t of e)i.devices.push(t.deviceId)})):document.querySelector(".video-options").style.display="none"},initChangeDevice:function(){var t=this,e=document.querySelector(".video-options>button");e.addEventListener("click",function(e){e.preventDefault(),t.devices.length==t.cur_devices&&(t.cur_devices=0);e=t.devices[t.cur_devices];t.streamOptions.video.deviceId={exact:e},t.cur_devices++,t.startStream()})},startStream:function(){var t=document.getElementById(COMPONENTNAME+"video"),i=this;i.stopStream(),navigator.mediaDevices.getUserMedia(i.streamOptions).then(function(e){t.srcObject=e,i.stream=e,t.play(),i.loadCameraDevices()})["catch"](function(e){alert("An error occurred: "+e)})},stopStream:function(){this.stream&&this.stream.getTracks().forEach(function(e){e.stop()})},_uploadImage:function(e){var t,i,n,o,a,s,r,d,c,l=this,u=this.get("host"),p=h.Handlebars.compile(IMAGETEMPLATE);for(u.saveSelection(),i=(t=u.get("filepickeroptions").image).savepath===undefined?"/":t.savepath,n=new FormData,o=0,a="",s=new XMLHttpRequest,r="",d=Object.keys(t.repositories),n.append("repo_upload_file",e),n.append("itemid",t.itemid),c=0;c<d.length;c++)if("upload"===t.repositories[d[c]].type){n.append("repo_id",t.repositories[d[c]].id)
;break}n.append("env",t.env),n.append("sesskey",M.cfg.sesskey),n.append("client_id",t.client_id),n.append("savepath",i),n.append("ctx_id",t.context.id),o=(new Date).getTime(),a="moodleimage_"+Math.round(1e5*Math.random())+"-"+o,u.focus(),u.restoreSelection(),r=p({url:M.util.image_url("i/loading_small","moodle"),alt:M.util.get_string("uploading",COMPONENTNAME),id:a}),u.insertContentAtFocusPoint(r),l.markUpdated(),s.onreadystatechange=function(){var e,t,i=l.editor.one("#"+a);if(4===s.readyState)if(200===s.status){if(e=JSON.parse(s.responseText)){if(e.error)throw i&&i.remove(!0),new M.core.ajaxException(e);(t=e).event&&"fileexists"===e.event&&(t=e.newfile),t=p({url:t.url,presentation:!0,classlist:"w-100"}),t=h.Node.create(t),i?i.replace(t):l.editor.appendChild(t),l.markUpdated()}}else h.use("moodle-core-notification-alert",function(){new M.core.alert({message:M.util.get_string("servererror","moodle")})}),i&&i.remove(!0)},s.open("POST",M.cfg.wwwroot+"/repository/repository_ajax.php?action=upload",!0),s.send(n),l.getDialogue({focusAfterHide:null}).hide(),this.stopStream()},bmpToBlob:function(e,t){const i=document.createElement("canvas");i.width=e.width,i.height=e.height;let n=i.getContext("bitmaprenderer");n?n.transferFromImageBitmap(e):i.getContext("2d").drawImage(e,0,0);t=i.toBlob(t);return i.remove(),t},b64toBlob:function(e,t,i){var n,o,a,s,r,d,c;for(t=t||"",i=i||512,n=atob(e),o=[],a=0;a<n.length;a+=i){for(s=n.slice(a,a+i),r=new Array(s.length),d=0;d<s.length;d++)r[d]=s.charCodeAt(d);c=new Uint8Array(r),o.push(c)}return new Blob(o,{type:t})}},{ATTRS:{}},{ATTRS:{}})},"@VERSION@");