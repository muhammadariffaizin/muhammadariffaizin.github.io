import loadNav from './loadNav.js'
import loadPage from './loadPage.js'

document.addEventListener("DOMContentLoaded", function() {
    M.Sidenav.init(document.querySelectorAll(".sidenav"));
    loadNav();

    let page = window.location.hash.substr(1);
    if (page === "") page = "home";
    console.log(page);
    loadPage(page);
})