import match from './loadMatch.js'
import league from './loadLeague.js'

const loadPage = (page) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            let content = document.querySelector("#body-content");

            if (this.status === 200) {
                content.innerHTML = xhttp.responseText;

                if (page === "home") {
                    league.getLeagues()
                        .then(value => { console.log(value) })
                        .then(() => {
                            const leagueId = document.querySelector(".card-league[id]").id;
                            // Inisialisasi saat halaman terload
                            match.getMatches(leagueId);
                            league.getLeagueStandings(leagueId);
                            league.getLeagueTeams(leagueId);
                            league.getLeagueInfo(leagueId);
                        })
                        .catch(() => {
                            M.toast({ html: `Failed refresh data! Please try again.` });
                        })
                } else if (page === "saved") {
                    match.getSavedMatches();
                } else if (page === "live") {
                    match.getLiveMatches();
                }

                M.Slider.init(document.querySelectorAll(".slider"), { indicators: false });
                M.Tabs.init(document.querySelectorAll(".tabs"), { swipeable: true });

            } else if (this.status === 404) {
                content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
                content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }
        }
    };
    xhttp.open("GET", `components/pages/${page}.html`, true);
    xhttp.send();
}

export default loadPage;