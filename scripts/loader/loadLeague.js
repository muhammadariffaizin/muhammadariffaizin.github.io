import fetchApi from '/scripts/data/dataApi.js'
import checkCache from '/scripts/data/dataCache.js'
import getLogo from '/scripts/data/dataLogo.js'
import helperDate from '/scripts/helper/date.js'
import preloader from '/scripts/helper/preloader.js'
import match from './loadMatch.js'

const footApi = new fetchApi();
const footCache = new checkCache();

const getLeagues = () => {
    return new Promise((resolve) => {
        preloader.setPreloader("leagues");
        let isCached = false;
        footCache.leagues()
            .then(data => {
                console.log(data);
                if (data !== undefined) {
                    loadCardLeague(data.competitions, "leagues");
                    document.querySelectorAll(".card-league[id]").forEach((card) => {
                        card.addEventListener("click", (() => {
                            match.getMatches(card.id);
                            getLeagueStandings(card.id);
                            getLeagueTeams(card.id);
                            getLeagueInfo(card.id);
                        }));
                    })
                    isCached = true;
                    resolve("Leagues loaded successfully!");
                }
            });
        footApi.leagues()
            .then(data => {
                loadCardLeague(data.competitions, "leagues");
                document.querySelectorAll(".card-league[id]").forEach((card) => {
                    card.addEventListener("click", (() => {
                        match.getMatches(card.id);
                        getLeagueStandings(card.id);
                        getLeagueTeams(card.id);
                        getLeagueInfo(card.id);
                    }));
                })
                resolve("Leagues loaded successfully!");
            })
            .catch(() => {
                // M.toast({html: `Failed refresh leagues! Please try again.`});
                if (isCached === false) {
                    preloader.removePreloader("leagues", "No internet connection. Can't load data.");
                    preloader.removePreloader("matches", "No internet connection. Can't load data.");
                    preloader.removePreloader("standings", "No internet connection. Can't load data.");
                    preloader.removePreloader("teams", "No internet connection. Can't load data.");
                    preloader.removePreloader("info", "No internet connection. Can't load data.");
                }
                // reject(error);
            });
    });
}

const getLeagueStandings = (id_league) => {
    preloader.setPreloader("standings");
    let isCached = false;
    footCache.leagueStandings(id_league)
        .then(data => {
            if (data !== undefined) {
                loadLeagueStandings(data.standings[0].table, "standings");
                isCached = true;
            }
        });
    footApi.leagueStandings(id_league)
        .then(data => {
            loadLeagueStandings(data.standings[0].table, "standings");
        })
        .catch(() => {
            // M.toast({html: `Failed refresh league standings! Please try again.`});
            if (isCached === false) { preloader.removePreloader("standings", "No internet connection. Can't load data."); }
        });
}

const getLeagueTeams = (id_league) => {
    preloader.setPreloader("teams");
    let isCached = false;
    footCache.leagueTeams(id_league)
        .then(data => {
            if (data !== undefined) {
                loadLeagueTeams(data.teams, "teams");
                isCached = true;
            }
        });
    footApi.leagueTeams(id_league)
        .then(data => {
            loadLeagueTeams(data.teams, "teams");
        })
        .catch(() => {
            // M.toast({html: `Failed refresh league teams! Please try again.`});
            if (isCached === false) { preloader.removePreloader("teams", "No internet connection. Can't load data."); }
        });
}

const getLeagueInfo = (id_league) => {
    preloader.setPreloader("info");
    let isCached = false;
    footCache.leagueInfo(id_league)
        .then(data => {
            if (data !== undefined) {
                loadLeagueInfo(data, "info");
                isCached = true;
            }
        });
    footApi.leagueInfo(id_league)
        .then(data => {
            loadLeagueInfo(data, "info");
        })
        .catch(() => {
            // M.toast({html: `Failed refresh league info! Please try again.`});
            if (isCached === false) { preloader.removePreloader("info", "No internet connection. Can't load data."); }
        });
}

const loadCardLeague = (data, id_container) => {
    let listLeaguesHTML = ``;
    data.forEach((league) => {
        listLeaguesHTML += `
        <div class="col">
            <div class="card hoverable card-league waves-effect waves-purple" id="${league.id}">
                <div class="card-content center">
                    <img class="img-league" src="${getLogo(league.id)}" loading="lazy" alt="${league.name}" width="150" height="150">
                    <span class="card-title">${league.name}</span>
                    <span>${league.area.name}</span>
                </div>
            </div>
        </div>
          `;
    });
    document.getElementById(id_container).innerHTML = listLeaguesHTML;
}

const loadLeagueStandings = (data, id_container) => {
        let tableStandingsHTML = `
        <table class="responsive-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Club</th>
                    <th>Play</th>
                    <th>Win</th>
                    <th>Draw</th>
                    <th>Lost</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
    `;
        data.forEach(function(standing) {
                    tableStandingsHTML += `
            <tr>
                <td>${standing.position}</td>
                <td>${standing.team.crestUrl !== null ? `<img src="${standing.team.crestUrl}" height="15px" class="circle" loading="lazy" alt="${standing.team.name}"> ` : ""}${standing.team.name}</td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
            </tr>
          `;
    });
    tableStandingsHTML += `
            </tbody>
        </table>
    `;
    document.getElementById(id_container).innerHTML = tableStandingsHTML;
}

const loadLeagueTeams = (data, id_container) => {
    let listTeamsHTML = ``;
    data.forEach(function (team) {
        listTeamsHTML += `
            <div class="card hoverable teams-item waves-effect waves-purple" team-id="${team.id}">
                <div class="valign-wrapper content-team">
                    ${team.crestUrl !== "" && team.crestUrl !== null ? `<img class="team-logo" src="${team.crestUrl}" loading="lazy" alt="${team.name}" width="150" height="150">` : ``}
                    <span class="team-name truncate">${team.name}</span>
                </div>
            </div>
          `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById(id_container).innerHTML = listTeamsHTML;
}

const loadLeagueInfo = (data, id_container) => {
    let infoHTML = `
        <div class="section container">
        <h5>${data.name}</h5>
        ${data.emblemUrl !== null ? `<img class="team-logo" src="${data.emblemUrl}" loading="lazy" alt="${data.name}">` : ``}
        <h6>${data.area.name}</h6>
        <div class="divider"></div>
        <p>Start Date : ${helperDate.utcToDays(data.currentSeason.startDate)}</p>
        <p>End Date : ${helperDate.utcToDays(data.currentSeason.endDate)}</p>
        <p>Current Matchday : ${data.currentSeason.currentMatchday}</p>
        <table class="responsive-table">
            <thead>
                <tr>
                  <th>#</th>
                  <th>Current Matchday</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Winner</th>
                </tr>
            </thead>
            <tbody>
    `;
    let count = 0;
    data.seasons.forEach(function (info) {
        count += 1;
        infoHTML += `
            <tr>
                <td>${count}</td>
                <td>${helperDate.utcToDays(info.startDate)}</td>
                <td>${helperDate.utcToDays(info.endDate)}</td>
                <td>${info.winner !== null ? `${info.winner.name}` : `-`}</td>
            </tr>
        `;
    })
    infoHTML += `
          </tbody>
        </table>
      </div>
      <div class="divider"></div>
    `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById(id_container).innerHTML = infoHTML;   
}

export default {
    getLeagues,
    getLeagueStandings,
    getLeagueTeams,
    getLeagueInfo
}