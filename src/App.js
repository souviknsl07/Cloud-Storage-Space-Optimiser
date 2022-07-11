import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage, auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import hash from "object-hash";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

import "./App.css";
import Login from "./Login";

function App() {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [user] = useAuthState(auth);
  const [videos, setVideos] = useState([]);

  useEffect(
    () =>
      onSnapshot(query(collection(db, "files")), (snapshot) => {
        setVideos(snapshot.docs);
      }),

    [db]
  );

  const formHandler = async (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    const hashVal = hash(file);

    if (videos.length === 0) {
      uploadFiles(file, hashVal);
    } else {
      const vid = videos.find(
        (vid) =>
          vid._document.data.value.mapValue.fields.hash.stringValue === hashVal
      );
      vid
        ? setUrl(vid._document.data.value.mapValue.fields.vidUrl.stringValue)
        : uploadFiles(file, hashVal);
    }
  };

  const uploadFiles = async (file, hashVal) => {
    if (!file) return;

    const docRef = await addDoc(collection(db, "files"), {
      userID: user.uid,
      username: user.displayName,
      hash: hashVal,
    });
    const storageRef = ref(storage, `/files/${docRef.id}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    await uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          await updateDoc(doc(db, "files", docRef.id), {
            vidUrl: url,
          });
          setUrl(url);
        });
      }
    );
  };

  return (
    <div className="App">
      {user ? (
        <>
          <h2>Hello {user.displayName}</h2>
          <form onSubmit={formHandler}>
            <input type="file" className="input" />
            <button type="submit">Upload</button>
          </form>
          <hr />

          {progress > 0 && <h3>Uploaded {progress} %</h3>}

          <button
            onClick={() => {
              auth.signOut();
              setUrl("");
              setProgress(0);
            }}
          >
            Sign Out
          </button>

          <hr />

          {url !== "" && (
            <video width="420" height="340" controls>
              <source src={url} type="video/mp4" />
            </video>
          )}
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
