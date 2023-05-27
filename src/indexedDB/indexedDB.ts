let db
const request: IDBOpenDBRequest = window.indexedDB.open("MyTestDatabase", 1)
request.onerror = function () {
  console.log("error")
}
request.onupgradeneeded = function (event) {
  db = (event.target as IDBRequest).result as IDBDatabase
  const objectStore = db.createObjectStore("date", { autoIncrement: true })
}

export async function readDatabase(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("MyTestDatabase", 1)
    request.onerror = function () {
      reject("i cannot read database")
    }

    request.onsuccess = function (event) {
      db = (event.target as IDBRequest).result as IDBDatabase
      let objectStore = db.transaction(["date"], "readonly").objectStore("date")
      objectStore.getAll().onsuccess = (event) => {
        console.log((event.target as IDBRequest).result as string[])
        resolve((event.target as IDBRequest).result as string[])
      }
    }
  })
}

export async function writeDateToDatabase(date: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("MyTestDatabase", 1)
    request.onerror = function () {
      reject("i cannot read database")
    }

    request.onsuccess = function (event) {
      db = (event.target as IDBRequest).result as IDBDatabase
      let objectStore = db
        .transaction(["date"], "readwrite")
        .objectStore("date")
      objectStore.add(date).onsuccess = () => {
        resolve(true)
      }
    }
  })
}
