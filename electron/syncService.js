import db from './database.js';

const SYNC_URL = 'http://localhost:5000/api/sync';

let isSyncing = false;
let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

export const syncData = async () => {
    if (isSyncing) return;
    isSyncing = true;
    
    try {
        const pendingSubmissions = db.prepare("SELECT * FROM progress WHERE sync_status = 'pending'").all();
        
        if (pendingSubmissions.length === 0) {
            isSyncing = false;
            return;
        }
        
        const response = await fetch(SYNC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            },
            body: JSON.stringify(pendingSubmissions)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Expected result.syncedIds to be an array of updated IDs
            if (result.syncedIds && result.syncedIds.length > 0) {
                const markSynced = db.prepare("UPDATE progress SET sync_status = 'synced' WHERE id = ?");
                
                // Using transaction for faster updates
                const updateTransaction = db.transaction((ids) => {
                    for (const id of ids) {
                        markSynced.run(id);
                    }
                });
                
                updateTransaction(result.syncedIds);
                console.log(`Synced ${result.syncedIds.length} submissions to backend.`);
            }
        } else {
            console.error('Failed to sync. Backend responded with status:', response.status);
        }
    } catch (error) {
        console.error('Error in syncData:', error.message);
    } finally {
        isSyncing = false;
    }
};

export const startSyncService = () => {
    // Run sync immediately on startup
    syncData();
    // Then run every 10 seconds
    setInterval(syncData, 10000);
};
