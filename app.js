const API="https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";
let role="Student",token="",resources=[];

const $=id=>document.getElementById(id);

document.querySelectorAll(".role").forEach(b=>{
 b.onclick=()=>{
  document.querySelectorAll(".role").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  role=b.dataset.role;
 }
});

$("loginForm").onsubmit=async e=>{
 e.preventDefault();

 $("loginMsg").textContent="Logging in...";

 try{
  const r=await post({
    action:"login",
    username:$("username").value,
    password:$("password").value
  });

  if(!r.ok) throw Error(r.error||"Login failed");

  token=r.token;
  role=r.role;

  $("loginView").classList.add("hidden");
  $("appView").classList.remove("hidden");

  $("userInfo").textContent=
  `${r.userId} • ${r.role}`;

  $("adminPanel").classList.toggle(
    "hidden",
    r.role!=="Librarian"
  );

  await loadResources();

 }catch(err){
  $("loginMsg").textContent=err.message;
 }
};


$("logout").onclick=()=>location.reload();


async function post(data){

 const res=await fetch(API,{
  method:"POST",
  headers:{
   "Content-Type":"text/plain;charset=utf-8"
  },
  body:JSON.stringify(data)
 });

 const text=await res.text();

 console.log("SERVER RESPONSE:",text);

 return JSON.parse(text);
}


async function loadResources(){

 const r=await post({
  action:"list",
  token
 });

 console.log("LIST:",r);

 if(!r.ok)
 throw Error(r.error||"Could not load resources");

 resources=r.resources||[];

 render();
}


function render(){

 const q=$("search").value.toLowerCase();

 const list=resources.filter(x=>
 !q ||
 [
 x.title,
 x.subject,
 x.type,
 x.department,
 x.year
 ].join(" ").toLowerCase().includes(q)
 );


 $("count").textContent=
 `${list.length} resource(s)`;


 $("resources").innerHTML=list.map(x=>`

 <article class="card">

 <h3>${esc(x.title)}</h3>

 <p>${esc(x.subject||"")}</p>

 <a href="${x.url}" target="_blank">
 Open Resource
 </a>

 </article>

 `).join("");

}


["search","type","department","semester"]
.forEach(id=>{
 if($(id)) $(id).oninput=render;
});



function toBase64(file){

 return new Promise((resolve,reject)=>{

 const rd=new FileReader();

 rd.onload=()=>{
 resolve(String(rd.result).split(",")[1]);
 };

 rd.onerror=reject;

 rd.readAsDataURL(file);

 });

}


function esc(s){

 return String(s??"")
 .replace(/[&<>"']/g,m=>({
 "&":"&amp;",
 "<":"&lt;",
 ">":"&gt;",
 '"':"&quot;",
 "'":"&#039;"
 }[m]));

}
