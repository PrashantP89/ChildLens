import {expect, test} from "@jest/globals";
import validatePhoto from "../features/validatePhoto";

test("rejects non-image files", () => {
    const file = new File(["dummy content"], "test.txt", { type: "text/plain" });
    const result = validatePhoto(file);
    expect(result).toBe("Please select a valid image file.");
});

test("rejects images larger than 5 MiB", () => {
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "largeImage.png", { type: "image/png" });
    const result = validatePhoto(largeFile);
    expect(result).toBe("Please select an image no larger than 5 MiB.");
});
test("accepts images of exactly 5 MiB", () => {
    const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024)], "largeImage.png", { type: "image/png" });
    const result = validatePhoto(largeFile);
    expect(result).toBeNull();
});

test("rejects images one byte larger than 5 MiB", () => {
    const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024 + 1)], "largeImage.png", { type: "image/png" });
    const result = validatePhoto(largeFile);
    expect(result).toBe("Please select an image no larger than 5 MiB.");
});

test("accepts valid images smaller than 5 MiB", () => {
    const validFile = new File([new ArrayBuffer(1024)], "validImage.png", { type: "image/png" });
    const result = validatePhoto(validFile);
    expect(result).toBeNull();
});