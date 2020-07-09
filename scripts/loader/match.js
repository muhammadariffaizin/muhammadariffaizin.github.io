import match from '/scripts/loader/loadMatch.js'
import db from '/scripts/data/dataDb.js'

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isFromSaved = urlParams.get("saved");
    let isSaved = false;
    const checkSaved = () => {
        return new Promise ((resolve) => {
            db.getById(urlParams.get("matchid")).then((data) => {
            if(data !== undefined) {
                isSaved = true;
            }
            console.log(isSaved);
            resolve(isSaved);
        })
    })};

    const btnSave = document.getElementById("save");
    const btnDelete = document.getElementById("delete");

    const refreshStatus = () => {    
        if(isFromSaved) {
            btnSave.style.display = 'none';
            btnDelete.style.display = 'inline-block';
        } else {
            btnSave.style.display = 'inline-block';
            btnDelete.style.display = 'none';
        }
        
        checkSaved()
            .then((result) => {
                if(result) {
                    btnSave.classList.add("disabled");
                } else {
                    btnSave.classList.remove("disabled");
                }
        })
    }

    if (isFromSaved) {
        match.getSavedMatchById();
        refreshStatus();
    } else {
        match.getMatchById()
        .then(() => {
            refreshStatus();
        });
    }

    btnSave.onclick = () => {
        match.getMatchById()
            .then((matchItem) => {
                db.saveForLater(matchItem);
            })
            .then(() => {
                refreshStatus();
            });
    };

    btnDelete.onclick = () => {
        match.getMatchById()
            .then((matchItem) => {
                db.deleteSave(matchItem);
            });
        refreshStatus();
    }
});