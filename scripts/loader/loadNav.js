import loadPage from './loadPage.js'

const loadNav = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200) return;

            document.querySelectorAll(".topnav, .sidenav").forEach((elm) => {
                elm.innerHTML = xhttp.responseText;
            });

            // Register all the nav to links inside the href links
            document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
                elm.addEventListener("click", (event) => {

                    const sidenav = document.querySelector(".sidenav");
                    M.Sidenav.getInstance(sidenav).close();

                    // Muat konten halaman yang dipanggil
                    let page = event.target.getAttribute("href").substr(1);
                    loadPage(page);
                });
            });
        }
    };
    
    xhttp.open("GET", "components/nav.html", true);
    xhttp.send();
}

export default loadNav;