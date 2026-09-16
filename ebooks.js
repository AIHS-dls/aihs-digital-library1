function openDept(dept){

let box=document.getElementById("booksList");


box.innerHTML=`

<h2>📚 ${dept} E-Books</h2>


<h3>First Year</h3>

<div class="card">

<a href="#">
Anatomy Text Book
</a>

</div>


<div class="card">

<a href="#">
Physiology Text Book
</a>

</div>



<h3>Second Year</h3>


<div class="card">

<a href="#">
Exercise Therapy Book
</a>

</div>


`;

}
