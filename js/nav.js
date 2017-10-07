var btnHamburger;
var navMainMobile;
var linksWrapperMobile;
var btnHamburger;

(() => {
	navMainMobile = document.querySelector('.nav-main-mobile');
	linksWrapperMobile = document.querySelector('.links-wrapper-mobile');
	btnHamburger = document.querySelector('.btn-hamburger');

	throttleResize();

	window.addEventListener('resize', throttleResize);
	btnHamburger.addEventListener('click', openMenu);
	console.log('hello');
})();

function openMenu(e) {
	if (linksWrapperMobile.style.display === "none") {
		linksWrapperMobile.style.display = "block"
	}
	else {
		linksWrapperMobile.style.display = "none";
	}
}

function throttleResize() {
	let resizeTimeout;

  if (!resizeTimeout) { // ignore if already running
  	resizeTimeout = setTimeout( ()=>{
    resizeTimeout = null;
    handleResize();
    }, 60) //delay time	
  }
}

function handleResize(){
	if (window.innerWidth > 767) {
		btnHamburger.style.display = 'none';
		linksWrapperMobile.style.display = "flex";
		navMainMobile.classList.add('nav-main');
		navMainMobile.classList.remove('nav-main-mobile');
		linksWrapperMobile.classList.add('links-wrapper');
		linksWrapperMobile.classList.remove('links-wrapper-mobile');
	}
	else {
		btnHamburger.style.display = 'block';
		linksWrapperMobile.style.display = "none";
		navMainMobile.classList.add('nav-main-mobile');
		navMainMobile.classList.remove('nav-main');
		linksWrapperMobile.classList.add('links-wrapper-mobile');
		linksWrapperMobile.classList.remove('links-wrapper');
	}
}


