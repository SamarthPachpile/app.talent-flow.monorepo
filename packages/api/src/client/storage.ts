export async function uploadFileToStorage(file: File | Blob, path?: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(`https://storage.talentflow.hub/${path || "uploads"}`);
      reader.readAsDataURL(file);
    } else {
      resolve(`https://storage.talentflow.hub/${path || "uploads"}`);
    }
  });
}

export const uploadCompanyFileToStorage = uploadFileToStorage;
export const uploadCandidateFileToStorage = uploadFileToStorage;
export const uploadAdminFileToStorage = uploadFileToStorage;
