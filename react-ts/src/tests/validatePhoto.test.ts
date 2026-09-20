import {expect, test} from "@jest/globals";
import validatePhoto from "../features/validatePhoto";

test("validatePhoto returns error for non-image file", () => {
    const file = new File(["dummy content"], "test.txt", { type: "text/plain" });
    const result = validatePhoto(file);
    expect(result).toBe("Please select a valid image file.");
});

test("validatePhoto returns error for image file larger than 5 MiB", () => {
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "largeImage.png", { type: "image/png" });
    const result = validatePhoto(largeFile);
    expect(result).toBe("Please select an image no larger than 5 MiB.");
});
test("validatePhoto returns null for image of exact 5 MB size", () => {
    const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024)], "largeImage.png", { type: "image/png" });
    const result = validatePhoto(largeFile);
    expect(result).toBeNull();
});

test("validatePhoto returns error for image of crossing boundary just 1 byte", () => {
    const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024 + 1)], "largeImage.png", { type: "image/png" });
    const result = validatePhoto(largeFile);
    expect(result).toBe("Please select an image no larger than 5 MiB.");
});

test("validatePhoto returns null for valid image file", () => {
    const validFile = new File([new ArrayBuffer(1024)], "validImage.png", { type: "image/png" });
    const result = validatePhoto(validFile);
    expect(result).toBeNull();
});