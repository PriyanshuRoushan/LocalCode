import Submission from '../models/Submission.js';

export const syncSubmissions = async (req, res) => {
  try {
    const submissions = req.body;

    if (!Array.isArray(submissions) || submissions.length === 0) {
      return res.status(400).json({ message: 'No valid data provided for sync' });
    }

    // Using bulkWrite with updatedAt conflict handling (unique id from SQLite)
    const result = await Submission.bulkWrite(
      submissions.map((item) => ({
        updateOne: {
          filter: { id: item.id }, // unique id from SQLite
          update: { $set: item },
          upsert: true
        }
      }))
    );

    res.status(200).json({
      message: 'Sync successful',
      syncedCount: result.modifiedCount + result.upsertedCount,
      // Pass back the ids of synced items so the client can mark them as synced
      syncedIds: submissions.map(item => item.id)
    });
  } catch (error) {
    console.error('Error during sync:', error);
    res.status(500).json({ message: 'Server error during synchronization' });
  }
};
