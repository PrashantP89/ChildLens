function validatePhoto(file:File):string|null {
    if (!file.type.startsWith("image/")) {
        return "Please select a valid image file.";
    }
    if (file.size > 5 * 1024 * 1024) {
        return "Please select an image no larger than 5 MiB.";
    }
    return null;
}
export default validatePhoto;