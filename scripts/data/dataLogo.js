const logoLeague = [
    {id: 2000, link: "/images/logos/2000.svg"},
    {id: 2001, link: "/images/logos/2001.svg"},
    {id: 2002, link: "/images/logos/2002.svg"},
    {id: 2003, link: "/images/logos/2003.svg"},
    {id: 2013, link: "/images/logos/2013.svg"},
    {id: 2014, link: "/images/logos/2014.svg"},
    {id: 2015, link: "/images/logos/2015.svg"},
    {id: 2016, link: "/images/logos/2016.svg"},
    {id: 2017, link: "/images/logos/2017.svg"},
    {id: 2018, link: "/images/logos/2018.svg"},
    {id: 2019, link: "/images/logos/2019.svg"},
    {id: 2021, link: "/images/logos/2021.svg"} 
]

const getLogo = (id, emblem = "") => {
    const result = logoLeague.filter(idlink => {
        return idlink.id == id;
    })

    // if the id is a league
    if(result.length > 0) {
        return result[0].link;
    } else if(emblem !== "" && emblem !== null && emblem !== undefined) {
        return emblem;
    }

    return "./images/icons/icon-192x192.png";
}

export default getLogo;