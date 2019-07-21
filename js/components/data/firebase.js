import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import config from '../../../config';

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        
        this.db = app.firestore();
        this.db.settings({
            cacheSizeBytes: this.db.CACHE_SIZE_UNLIMITED
        });
        this.db.enablePersistence();

        this.storage = app.storage();
    }
}

const firebase = new Firebase();
export default firebase;
