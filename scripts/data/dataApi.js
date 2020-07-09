import helperDate from '/scripts/helper/date.js'

class fetchApi {
    constructor() {
        this.base_url = "https://api.football-data.org/v2/",
        this.token = "d432fef486d2407489cadb3df626416d"
    }

    async call(path) {
        const result = await fetch(`${this.base_url}${path}`, {
            headers: {
                'X-Auth-Token': this.token
            }
        })
        return await result.json();
    }

    async leagues() {
        return await this.call(`competitions?plan=TIER_ONE`);
    }

    async leagueStandings(id_league) {
        return await this.call(`competitions/${id_league}/standings`);
    }

    async leagueTeams(id_league) {
        return await this.call(`competitions/${id_league}/teams`);
    }

    async leagueInfo(id_league) {
        return await this.call(`competitions/${id_league}`);
    }

    async matches(id_league, countMonth = -1) {
        return await this.call(`competitions/${id_league}/matches?dateFrom=${helperDate.strDatePast(countMonth)}&dateTo=${helperDate.strDateNow()}`);
    }

    async matchDetail(id_match) {
        return await this.call(`matches/${id_match}`);
    }

    async liveMatch() {
        return await this.call(`matches?status=LIVE`);
    }
}

export default fetchApi;