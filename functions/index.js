const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();




exports.darChatsUsuario = functions.https.onCall((data) => {


  return new Promise((resolve, reject)=>{

  let db = admin.firestore();

  let users = []

  let username = data.username;

  db.collection('usuarios').get().then(snapshot=>{
        
        users = snapshot.docs.map(doc=>{

            return doc.data();
        })

        let result = [];      

        result = users.filter(user => {

            return user.username == username;
        })

        let total = result[0].chats[0]._path.segments[1];

        var docRef = db.collection("chats").doc(total);

    docRef.get().then(function(doc) {
    if (doc.exists) {

        resolve(doc)

    } else {

        console.log("No such document!");
    }
})

    }).catch(error=>{
        reject(error)
    })
  })// Grab the text parameter.

  
 
});


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onCall((data) => {

  return new Promise((resolve, reject)=>{

    let db = admin.firestore();

  const location = data.location;

  const sport = data.sport;

  const range = data.range;
  let users=[]

db.collection('usuarios').get().then(snapshot=>{
        
        users = snapshot.docs.map(doc=>{
            return doc.data();
        })
        let result = []       
        result = users.filter(user=>{

            return haversianDistance(location, user.location) <= range;
        })

        resolve(result)

    }).catch(error=>{
        reject(error)
    })
  })// Grab the text parameter.

  
 
});


function haversianDistance (location1, location2) {


    var lat1 = location1.lat;

    var long1 = location1.lon;

    var lat2 = location2.lat;

    var long2 = location2.lon;

    var earthR = 6371; //km

    var x1 = lat2 - lat1;

    var dLat = x1* Math.PI / 180;

    var x2 = long2 - long1;

    var dLon = x2* Math.PI / 180;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
            Math.cos(lat1* Math.PI / 180) * Math.cos(lat2* Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    var d = earthR * c;

    return Number(d);
}



