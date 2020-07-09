import fetchApi from '/scripts/data/dataApi.js'
import checkCache from '/scripts/data/dataCache.js'
import db from '/scripts/data/dataDb.js'
import helperDate from '/scripts/helper/date.js'
import preloader from '/scripts/helper/preloader.js'

const footApi = new fetchApi();
const footCache = new checkCache();

const getMatches = (id_league) => {
    preloader.setPreloader("matches");
    let isCached = false;
    footCache.matches(id_league, -3)
        .then(data => {
            if (data !== undefined) {
                let dataMatches = data.matches.reverse();
                dataMatches = dataMatches.slice(0, 10);
                loadMatchCardList(dataMatches, "matches", `
                    <h5>No matches available for 3 months ago.</h5>
                `);
                document.querySelectorAll(".matches-item[match-id]").forEach((matchCard) => {
                    matchCard.addEventListener("click", (() => {
                        window.location.href = `${window.location.origin}/match.html?matchid=${matchCard.getAttribute("match-id")}`;
                    }));
                })
                isCached = true;
            }
        });
    footApi.matches(id_league, -3)
        .then(data => {
            let dataMatches = data.matches.reverse();
            dataMatches = dataMatches.slice(0, 10);
            loadMatchCardList(dataMatches, "matches", `
                <h5>No matches available for 3 months ago.</h5>
            `);
            document.querySelectorAll(".matches-item[match-id]").forEach((matchCard) => {
                matchCard.addEventListener("click", (() => {
                    window.location.href = `${window.location.origin}/match.html?matchid=${matchCard.getAttribute("match-id")}`;
                }));
            });
        })
        .catch(() => {
            // M.toast({html: `Failed refresh matches! Please try again.`});
            if (isCached === false) { preloader.removePreloader("matches", "No internet connection. Can't load data."); }
        });
}

const getMatchById = () => {
    return new Promise((resolve, reject) => {
        preloader.setPreloader("match-score");
        const urlParams = new URLSearchParams(window.location.search);
        const id_match = urlParams.get("matchid");
        let isCached = false;
        footCache.matchDetail(id_match)
            .then(data => {
                if (data !== undefined) {
                    loadMatchDetail(data.match, "match-score");
                    M.Parallax.init(document.querySelectorAll(".parallax"), { indicator: false });
                    isCached = true;
                    resolve(data);
                }
            });
        footApi.matchDetail(id_match)
            .then(data => {
                loadMatchDetail(data.match, "match-score");
                M.Parallax.init(document.querySelectorAll(".parallax"), { indicator: false });
                resolve(data);
            })
            .catch(() => {
                // M.toast({html: `Failed refresh match details! Please try again.`});
                if (isCached === false) { preloader.removePreloader("match-score", "No internet connection. Can't load data."); }
            });
    });
}

const getLiveMatches = () => {
    preloader.setPreloader("liveMatches");
    let isCached = false;
    footCache.liveMatch()
        .then(data => {
            if (data !== undefined) {
                loadMatchCardList(data.matches, "liveMatches", `
                    <h5>No LIVE Matches available for now. Please check again later.</h5>
                    <h5 class="waves-effect waves-light purple darken-4 btn" onclick="location.reload()">Click to refresh</h5>
                `)
                document.querySelectorAll(".matches-item[match-id]").forEach((matchCard) => {
                    matchCard.addEventListener("click", (() => {
                        window.location.href = `${window.location.origin}/match.html?matchid=${matchCard.getAttribute("match-id")}`;
                    }));
                })
                M.Parallax.init(document.querySelectorAll(".parallax"), { indicators: false });
                isCached = true;
            }
        });
    footApi.liveMatch()
        .then(data => {
            loadMatchCardList(data.matches, "liveMatches", `
                <h5>No LIVE Matches available for now. Please check again later.</h5>
                <h5 class="waves-effect waves-light purple darken-4 btn" onclick="location.reload()">Click to refresh</h5>
            `);
            document.querySelectorAll(".matches-item[match-id]").forEach((matchCard) => {
                matchCard.addEventListener("click", (() => {
                    window.location.href = `${window.location.origin}/match.html?matchid=${matchCard.getAttribute("match-id")}`;
                }));
            })
            M.Parallax.init(document.querySelectorAll(".parallax"), { indicators: false });
        })
        .catch(() => {
            // M.toast({html: `Failed refresh live matches! Please try again.`});
            if (isCached === false) { preloader.removePreloader("liveMatches", "No internet connection. Can't load data."); }
        });
}

const getSavedMatches = () => {
    preloader.setPreloader("matches");
    db.getAll().then((matches) => {
            loadMatchCardList(matches, "matches", `
            <h5>No saved matches here.</h5>
            <h5>You can save your favourite matches from homepage now, the saved matches will be shown here.</h5>
        `);
            M.Parallax.init(document.querySelectorAll(".parallax"), { indicators: false });
            document.querySelectorAll(".matches-item[match-id]").forEach((matchos) => {
                matchos.addEventListener("click", (() => {
                    window.location.href = `${window.location.origin}/match.html?matchid=${matchos.getAttribute("match-id")}&saved=true`;
                }));
            })
        })
        .catch(() => {
            M.toast({ html: `Failed refresh saved matches! Database error.` });
            if (isCached === false) { preloader.removePreloader("matches", "Database error."); }
        });
}

const getSavedMatchById = () => {
    preloader.setPreloader("match-score");
    const urlParams = new URLSearchParams(window.location.search);
    const id_match = urlParams.get("matchid");
    db.getById(id_match).then((match) => {
            loadMatchDetail(match, "match-score")
        })
        .catch(() => {
            M.toast({ html: `Failed refresh saved match detail! Database error.` });
            if (isCached === false) { preloader.removePreloader("match-score", "Database error."); }
        });
}

const loadMatchCardList = (data, id_list, empty_message = ``) => {
    let listMatchesHTML = ``;
    if (data.length !== 0) {
        data.forEach(match => {
            const formatted_days = helperDate.utcToDays(match.utcDate);
            const formatted_time = helperDate.utcToTime(match.utcDate);
            listMatchesHTML += `
            <div class="container matches-list">
            <div class="card hoverable matches-item waves-effect waves-purple" match-id="${match.id}">
                <div class="valign-wrapper content-match">
                    <div class="team center-align">
                        <span class="title">${match.homeTeam.name}</span>
                    </div>
                    <div class="condition">
                        <span class="matchdate">${formatted_days}</span>
                        <span class="matchtime">${formatted_time}</span>
                        <span class="score">${match.score.fullTime.homeTeam === null ? "" : match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam === null ? "" : match.score.fullTime.awayTeam}</span>
                        <span class="status">${match.status}</span>
                    </div>
                    <div class="team center-align">
                        <span class="title">${match.awayTeam.name}</span>
                    </div>
                </div>
            </div>
            </div>
            `;
        });
    } else {
        listMatchesHTML += `
        <div class="card center-align matches-item">
            <div class="content-match no-content">
                ${empty_message}
            </div>
        </div>
        `;
    }
    document.getElementById(id_list).innerHTML = listMatchesHTML;
}

const loadMatchDetail = (data, id_container) => {
        const formatted_days = helperDate.utcToDays(data.utcDate);
        const formatted_time = helperDate.utcToTime(data.utcDate);
        let matchDetailHTML = `
        <div class="card matches-item">
            <div class="valign-wrapper content-match">
                <div class="team center-align">
                    <span class="title">${data.homeTeam.name}</span>
                </div>
                <div class="condition">
                    <span class="matchdate">${formatted_days}</span>
                    <span class="matchtime">${formatted_time}</span>
                    <span class="score">${data.score.fullTime.homeTeam === null ? "" : data.score.fullTime.homeTeam} - ${data.score.fullTime.awayTeam === null ? "" : data.score.fullTime.awayTeam}</span>
                    <span class="status">${data.status}</span>
                </div>
                <div class="team center-align">
                    <span class="title">${data.awayTeam.name}</span>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="row">
                <div class="col s12 m12 l12 center-align"><h5>Full Time</h5></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.fullTime.homeTeam !== null ? data.score.fullTime.homeTeam : `-`}</span></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.fullTime.awayTeam !== null ? data.score.fullTime.awayTeam : `-`}</span></div>
                <div class="col s12 m12 l12 center-align"><h5>Half Time</h5></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.halfTime.homeTeam !== null ? data.score.halfTime.homeTeam : `-`}</span></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.halfTime.awayTeam !== null ? data.score.halfTime.awayTeam : `-`}</span></div>
                <div class="col s12 m12 l12 center-align"><h5>Extra Time</h5></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.extraTime.homeTeam !== null ? data.score.extraTime.homeTeam : `-`}</span></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.extraTime.awayTeam !== null ? data.score.extraTime.awayTeam : `-`}</span></div>
                <div class="col s12 m12 l12 center-align"><h5>Penalties</h5></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.penalties.homeTeam !== null ? data.score.penalties.homeTeam : `-`}</span></div>
                <div class="col s6 m6 l6 center-align"><span>${data.score.penalties.awayTeam !== null ? data.score.penalties.awayTeam : `-`}</span></div>
            </div>
        </div>
        <div class="divider"></div>
    `;
    document.getElementById(id_container).innerHTML = matchDetailHTML;
}

export default {
    getMatches,
    getMatchById,
    getLiveMatches,
    getSavedMatches,
    getSavedMatchById
};