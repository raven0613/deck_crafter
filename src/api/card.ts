"use server"
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { handleGetFirebaseDB } from "./firebase";
import { ICard } from "@/type/card";
import { v4 as uuidv4 } from 'uuid';

// use server 一定要傳 async function 出來
export async function handleGetCards() {
    try {
        const db = await handleGetFirebaseDB();
        const q = query(collection(db, "card"));
        const cardSnap = await getDocs(q);

        if (cardSnap) {
            const data: ICard[] = [];
            cardSnap.forEach((doc) => {
                data.push(doc.data() as ICard);
              });
            // console.log("Document data:", data);
            return { code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS" };
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return { code: 404, status: "FAIL", data: null, message: "No such document!" };
        }
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    }
}

// use server 一定要傳 async function 出來
export async function handleGetCard(id: string) {
    try {
        const db = await handleGetFirebaseDB();
        const docRef = doc(db, "card", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // console.log("Document data:", docSnap.data());
            return { code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS" };
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return { code: 404, status: "FAIL", data: null, message: "No such document!" };
        }
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    }
}

export async function handleAddCard(data: ICard) {
    const id = `card_${uuidv4()}`;
    const addData = { ...data, id };
    try {
        const db = await handleGetFirebaseDB();
        const cardCollection = collection(db, 'card');
        console.log("addData", addData)
        await setDoc(doc(cardCollection, id), addData);
        // await setDoc(doc(cardCollection, `${id}/boardElement`, id), addData);
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    } finally {
        return {
            code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS"
        };
    }
}

export async function handleUpdateCard(data: ICard) {
    try {
        const db = await handleGetFirebaseDB();
        const cardRef = doc(db, "card", data.id);

        await updateDoc(cardRef, {
            boardElement: data.boardElement
        });
    } catch (error) {
        console.log("error", error)
        return { code: 500, status: "FAIL", message: JSON.stringify(error), data: null };
    } finally {
        return {
            code: 200, status: "SUCCESS", data: JSON.stringify(data), message: "SUCCESS"
        };
    }
}