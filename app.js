const departments=[
" Bachelor of Physiotherapy".trim(),
"Master of Physiotherapy",
"Bachelor of Medical Laboratory Technology",
"Bachelor of Medical Imaging Technology",
"Master of Hospital Administration","ATOT"];

let BACKEND=localStorage.getItem("aihs_backend")||"";
let TOKEN=sessionStorage.getItem("aihs_token")||"";
let resources=[];

const $=id=>document.getElementById(id);
departments.forEach((d,i)=>{["dept","adept"].forEach(id=>{let o=document.createElement("option");o.value=d;o.textContent=d;$(id).appendChild(o)});let c=document.createElement("div");c.className="dept";c.innerHTML=`<b>0${i+1}</b><h3>${esc(d)}</h3>`;$("depts").appendChild(c)});
$("yr").textContent=new Date().getFullYear();
$("backend").value=BACKEND;

function saveBackend(){BACKEND=$("backend").value.trim().replace(/\/$/,"");localStorage.setItem("aihs_backend",BACKEND);load();}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){
 let q=$("search").value.toLowerCase(),d=$("dept").value,t=$("type").value,s=$("sem").value;
 let arr=resources.filter(r=>(!q||[r.title,r.type,r.department,r.semester,r.subject,r.year].join(" ").toLowerCase().includes(q))&&(!d||r.department==d)&&(!t||r.type==t)&&(!s||String(r.semester)==s));
 $("grid").innerHTML=arr.map(r=>`<article class="card"><span class="tag">${esc(r.type)}</span><h3>${esc(r.title)}</h3><div class="meta">${esc(r.department)}${r.semester?" • Semester "+esc(r.semester):""}</div><div class="meta">${esc(r.subject||"")}${r.year?" • "+esc(r.year):""}</div><div class="open"><a target="_blank" rel="noopener" href="${esc(r.url||"#")}">Open Resource →</a></div></article>`).join("");
 $("empty").hidden=arr.length>0;
}
["search","dept","type","sem"].forEach(id=>$(id).addEventListener("input",render));

async function api(action,payload={}){
 if(!BACKEND) throw new Error("First paste and save the deployed Apps Script Web App URL.");
 let r=await fetch(BACKEND,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...payload})});
 let data=await r.json(); if(!data.ok)throw new Error(data.error||"Request failed"); return data;
}
async function load(){
 try{let data=await api("list");resources=data.resources||[];render()}catch(e){resources=[];render()}
}
async function login(){
 try{let d=await api("login",{username:$("user").value,password:$("pass").value});TOKEN=d.token;sessionStorage.setItem("aihs_token",TOKEN);$("loginArea").hidden=true;$("dash").hidden=false;await adminList()}catch(e){$("loginMsg").textContent=e.message}
}
async function adminList(){
 try{let d=await api("adminList",{token:TOKEN});$("adminList").innerHTML="<h3>Current Resources</h3>"+(d.resources||[]).map(r=>`<div class="adminitem"><b>${esc(r.title)}</b><br><small>${esc(r.type)} • ${esc(r.department)} • <a target="_blank" href="${esc(r.url)}">Open</a> • <button onclick="del('${esc(r.id)}')">Delete</button></small></div>`).join("")}catch(e){$("loginMsg").textContent=e.message}
}
async function upload(){
 let f=$("file").files[0]; if(!f)return $("uploadMsg").textContent="Choose a file.";
 if(f.size>25*1024*1024)return $("uploadMsg").textContent="Please keep each upload below 25 MB for this free setup.";
 let b64=await new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f)});
 try{
  $("uploadMsg").textContent="Uploading...";
  await api("add",{token:TOKEN,title:$("title").value,type:$("atype").value,department:$("adept").value,semester:$("asem").value,subject:$("subject").value,year:$("year").value,fileName:f.name,mimeType:f.type||"application/octet-stream",data:b64});
  $("uploadMsg").textContent="Uploaded successfully."; ["title","asem","subject","year","file"].forEach(id=>$(id).value=""); await load(); await adminList();
 }catch(e){$("uploadMsg").textContent=e.message}
}
async function del(id){if(!confirm("Delete this resource?"))return;try{await api("delete",{token:TOKEN,id});await load();await adminList()}catch(e){alert(e.message)}}
function logout(){TOKEN="";sessionStorage.removeItem("aihs_token");$("dash").hidden=true;$("loginArea").hidden=false}
load();
