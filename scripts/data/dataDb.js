import idb from '/scripts/lib/idb.js'
import loadPage from '/scripts/loader/loadPage.js'

const dbPromised = idb.open("getdeball", 1, function(upgradeDb) {
    const matchesObjectStore = upgradeDb.createObjectStore("matches", {
      keyPath: "id"
    });
    matchesObjectStore.createIndex("match_homeTeam_name", "match_homeTeam_name", { unique: false });
    matchesObjectStore.createIndex("match_awayTeam_name", "match_awayTeam_name", { unique: false });
  });

const saveForLater = (data) => {
  dbPromised
    .then((db) => {
      let tx = db.transaction("matches", "readwrite");
      let store = tx.objectStore("matches");
      store.put(data.match);
      return tx.complete;
    })
    .then(() => {
      console.log("Match detail has been saved");
      M.toast({
        html: `Match detail has been saved`
      })
    })
    .catch((error) => {
      console.log("Failed saving match")
      M.toast({
        html: `Failed saving match`
      })
    });
  }

const getAll = () => {
  return new Promise((resolve, reject) => {
      dbPromised
        .then((db) => {
          let tx = db.transaction("matches", "readonly");
          let store = tx.objectStore("matches");
          return store.getAll();
        })
        .then((match) => {
          console.log("Saved matches have been loaded")
          resolve(match);
        })
        .catch((error) => {
          console.log("Failed loading saved matches")
          M.toast({
            html: `Failed loading saved matches`
          })
          reject(error);
        });
    });
}

const getById = (id) => {
  return new Promise((resolve, reject) => {
      dbPromised
          .then((db) => {
              let tx = db.transaction("matches", "readonly");
              let store = tx.objectStore("matches");
              return store.get(parseInt(id));
          })
          .then((match) => {
              console.log(`Match with id (${id}) have been loaded`);
              resolve(match);
          })
          .catch((error) => {
              console.log(`Failed loading match with id ${id}`);
              M.toast({
                html: `Failed loading match with id ${id}`
              })
              reject(error);
          });
  });
}
  
const deleteSave = (data) => {
  dbPromised
      .then((db) => {
          let tx = db.transaction("matches", "readwrite");
          let store = tx.objectStore("matches");
          store.delete(data.match.id);
          return tx.complete;
      })
      .then(() => {
          console.log("Match have been deleted");
          M.toast({
            html: `Match have been deleted`,
            completeCallback: (() => {
              window.location.href = window.location.origin + `#saved`
            })
          })
      })
      .catch((error) => {
          console.log(`Failed deleting match with id (${data.match.id})`);
          M.toast({
            html: `Failed deleting match with id (${data.match.id})`
          })
      });
}

export default {
  getAll,
  getById,
  deleteSave,
  saveForLater
}