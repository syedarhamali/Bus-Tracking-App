import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { firebaseDb } from "./init";

const firebaseUpdateBusLocation = async (collectionName,busId, obj) => {
  try {
    const busRef = doc(firebaseDb, collectionName, busId);
   const res = await updateDoc(busRef, {
    time: serverTimestamp(),
    type: 'bus',
        ...obj
    });
    return res;
  } catch (error) {
    console.error(error.message);
  }
};

const firebaseUpdateDoc = async (collectionName, id, obj) => {
  try {
    const docRef = doc(firebaseDb, collectionName, id);
    await updateDoc(docRef, obj);
  } catch (error) {
    console.error(error);
  }
};



export { firebaseUpdateBusLocation, firebaseUpdateDoc };
