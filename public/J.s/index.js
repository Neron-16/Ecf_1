// mobile menu
const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#navbarBasicExample');
const button = document.getElementById('fleche');
const animo = document.getElementById('animo');



burgerIcon.addEventListener('click',() =>{
    navbarMenu.classList.toggle('is-active')
})

//télécharger un image"admin/addhabi"
const fileInput = document.querySelector("#file-js-example input[type=file]");
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector("#file-js-example .file-name");
    fileName.textContent = fileInput.files[0].name;
  }
};

button.addEventListener('click',() =>{ 

  if(getComputedStyle(animo).display!="none"){
    animo.style.display = "none";
  } else {
    animo.style.display = "block";
  }

})