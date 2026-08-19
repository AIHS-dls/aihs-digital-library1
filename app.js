const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";
let role="Student",token="",resources=[];

const $=id=>document.getElementById(id);
document.querySelectorAll(".role").forEach(b=>b.onclick=()=>{document.querySelectorAll(".role").forEach(x=>x.classList.remove("active"));b.classList.add("active");role=b.dataset.role;});

$("loginForm").onsubmit=async e=>{
 e.preventDefault(); $("loginMsg").textContent="Logging in...";
 try{
  const r=await post({action:"login",username:$("username").value,password:$("password").value});
  if(!r.ok) throw Error(r.error||"Login failed");
  token=r.token; role=r.role;
  $("loginView").classList.add("hidden"); $("appView").classList.remove("hidden");
  $("userInfo").textContent=`${r.userId} • ${r.role}`;
  $("adminPanel").classList.toggle("hidden",r.role!=="Librarian");
  await loadResources();
 }catch(err){$("loginMsg").textContent=err.message}
};

$("logout").onclick=()=>location.reload();

async function post(data){

 const res = await fetch(API,{
   method:"POST",
   headers:{
     "Content-Type":"text/plain;charset=utf-8"
   },
   body:JSON.stringify(data)
 });

 const text = await res.text();

 console.log("SERVER RESPONSE:",text);

 return JSON.parse(text);

}
async function loadResources(){
 const r=await post({action:"list",token});
 if(!r.ok) throw Error(r.error||"Could not load resources");
 resources=r.resources||[]; render();
}

function render(){
 const q=$("search").value.toLowerCase(),type=$("type").value,dept=$("department").value,sem=$("semester").value;
 const list=resources.filter(x=>
  (!q||[x.title,x.subject,x.type,x.department,x.year].join(" ").toLowerCase().includes(q)) &&
  (!type||x.type===type)&&(!dept||x.department===dept)&&(!sem||x.semester===sem)
 );
 $("count").textContent=`${list.length} resource(s)`;
 $("empty").classList.toggle("hidden",list.length>0);
 $("resources").innerHTML=list.map(x=>`<article class="card"><span class="badge">${esc(x.type||"Other")}</span><h3>${esc(x.title)}</h3><p>${esc(x.subject||"")} ${x.year?"• "+esc(x.year):""}</p><p>${esc(x.department||"")} ${x.semester?"• Semester "+esc(x.semester):""}</p><a href="${escAttr(x.url)}" target="_blank" rel="noopener">Open Resource</a></article>`).join("");
}

["search","type","department","semester"].forEach(id=>$(id).oninput=render);

$("userForm").onsubmit=async e=>{
 e.preventDefault();$("userMsg").textContent="Creating...";
 try{
  const r=await post({action:"createUser",token,userId:$("newId").value,name:$("newName").value,password:$("newPass").value,role:$("newRole").value,department:$("newDept").value});
  if(!r.ok)throw Error(r.error||"Failed");
  $("userMsg").textContent=`Created ${r.user.userId} (${r.user.role})`;
  e.target.reset();
 }catch(err){$("userMsg").textContent=err.message}
};

$("uploadForm").onsubmit=async e=>{
 e.preventDefault(); const f=$("file").files[0]; if(!f)return;
 $("uploadMsg").textContent="Uploading...";
 try{
  const data=await toBase64(f);
  const r=await post({action:"add",token,title:$("title").value,type:$("rtype").value,subject:$("subject").value,year:$("year").value,department:$("rdept").value,semester:$("rsem").value,fileName:f.name,mimeType:f.type,data});
  if(!r.ok)throw Error(r.error||"Upload failed");
  $("uploadMsg").textContent="Uploaded successfully."; e.target.reset(); await loadResources();
 }catch(err){$("uploadMsg").textContent=err.message}
};

function toBase64(file){return new Promise((resolve,reject)=>{const rd=new FileReader();rd.onload=()=>resolve(String(rd.result).split(",")[1]);rd.onerror=reject;rd.readAsDataURL(file)})}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escAttr(s){return esc(s)}
