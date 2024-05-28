import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';

const ratingsRef = collection(db, 'ratings');

function Welcome() {
  const [user] = useAuthState(auth);
  const [ratingsCount, setRatingsCount] = useState<number | null>(null);

  if (!user) throw new Error('No user');

  useEffect(() => {
    (async () => {
      const ratingsQuery = query(ratingsRef, where('userId', '==', user.uid));
      const snapshot = await getCountFromServer(ratingsQuery);

      setRatingsCount(snapshot.data().count);
    })();
  }, [user.uid]);

  return (
    <main>
      <p className="text-lg mb-8">Hello {user.displayName}!</p>
      {ratingsCount === null && <p>Loading your data</p>}
      {Number.isInteger(ratingsCount) &&
        (ratingsCount === 0 ? (
          <p>
            <span>You don't have any ratings yet. Please </span>
            <Link to="/rate" className="underline">
              rate
            </Link>
            <span> your first movie.</span>
          </p>
        ) : (
          <p>
            <span>Go to </span>
            <Link to="/recommendations" className="underline">
              recommendations
            </Link>
            <span> to get inspired.</span>
          </p>
        ))}
    </main>
  );
}

export default Welcome;