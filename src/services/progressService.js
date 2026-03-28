export const saveProblemProgress = async (problemData) => {
  return await window.electronAPI.saveProgress(problemData);
};

export const getProblemProgress = async () => {
  return await window.electronAPI.getProgress();
};