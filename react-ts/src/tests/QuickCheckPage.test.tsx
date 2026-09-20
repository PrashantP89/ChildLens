import { expect, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import QuickCheckPage from "../features/QuickCheckPage";
import userEvent from "@testing-library/user-event";



test("disables Analyze when no photo is selected", () => {
  render(<QuickCheckPage />);

  const button = screen.getByRole("button", {
    name: /analyze observation/i,
  });

  expect(button).toBeDisabled();
});

test("enables Analyze when a photo is selected", async () => {
    const user = userEvent.setup();
  render(<QuickCheckPage />);

  const fileInput = screen.getByLabelText(/choose an activity photo/i);
  const button = screen.getByRole("button", {
    name: /analyze observation/i,
  });

  const file = new File(["dummy content"], "test.png", { type: "image/png" });
  await user.upload(fileInput, file);

  expect(button).toBeEnabled();
});

test("displays error message for uploading 1 byte over the limit", async () => {
    const user = userEvent.setup();
  render(<QuickCheckPage />);

  const fileInput = screen.getByLabelText(/choose an activity photo/i);

  const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024 + 1)], "largeImage.png", { type: "image/png" });
  await user.upload(fileInput, largeFile);

  const errorMessage = screen.getByRole("alert");
  expect(errorMessage).toHaveTextContent("Please select an image no larger than 5 MiB.");
});

test("displays error message for uploading non-image file", async () => {
    const user = userEvent.setup({ applyAccept: false });
  render(<QuickCheckPage />);

  const fileInput = screen.getByLabelText(/choose an activity photo/i);

  const nonImageFile = new File(["dummy content"], "test.txt", { type: "text/plain" });
  await user.upload(fileInput, nonImageFile);

  const errorMessage = screen.getByRole("alert");
  expect(errorMessage).toHaveTextContent("Please select a valid image file.");
});

test("recovers after replacing an oversized image with a valid image", async () => {
    const user = userEvent.setup();
  render(<QuickCheckPage />);

  const fileInput = screen.getByLabelText(/choose an activity photo/i);
  const button = screen.getByRole("button", {
    name: /analyze observation/i,
  });

  // Upload an oversize image
  const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024 + 1)], "largeImage.png", { type: "image/png" });
  await user.upload(fileInput, largeFile);
  // Verify Analyze button is still disabled after uploading an oversize image
  expect(button).toBeDisabled();

  // Verify alert is displayed
  const errorMessage = screen.getByRole("alert");
  expect(errorMessage).toHaveTextContent("Please select an image no larger than 5 MiB.");
  
  // Upload a valid image
  const validFile = new File([new ArrayBuffer(1024)], "validImage.png", { type: "image/png" });
  await user.upload(fileInput, validFile);

  // Verify alert is dismissed
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();

  // Verify Analyze button is enabled
  expect(button).toBeEnabled();
 
});
test("displays completed status after analysis", async () => {
    const user = userEvent.setup();
  render(<QuickCheckPage />);

  const fileInput = screen.getByLabelText(/choose an activity photo/i);
  const button = screen.getByRole("button", {
    name: /analyze observation/i,
  });

  const file = new File(["dummy content"], "test.png", { type: "image/png" });
  await user.upload(fileInput, file);

  await user.click(button);

expect(
  await screen.findByText(
    "Sample analysis completed.",
    undefined,
    { timeout: 3000 },
  ),
).toBeInTheDocument();
});
test("displays analyzing status while analysis is in progress", async () => {
    const user = userEvent.setup();
  render(<QuickCheckPage />);

  const fileInput = screen.getByLabelText(/choose an activity photo/i);
  const button = screen.getByRole("button", {
    name: /analyze observation/i,
  });

  const file = new File(["dummy content"], "test.png", { type: "image/png" });
  await user.upload(fileInput, file);

  await user.click(button);

  const statusMessage = await screen.findByRole("status");
  expect(statusMessage).toHaveTextContent("Analyzing observation...");
});
test("Editing after completion resets the status", async () => {
    const user = userEvent.setup();
  render(<QuickCheckPage />);

  const fileInput = screen.getByLabelText(/choose an activity photo/i);
  const button = screen.getByRole("button", {
    name: /analyze observation/i,
  });

  const file = new File(["dummy content"], "test.png", { type: "image/png" });
  await user.upload(fileInput, file);

  await user.click(button);

  await screen.findByText(
    "Sample analysis completed.",
    undefined,
    { timeout: 3000 },
  );

  // Edit the observation to reset the status
  const observationTextarea = screen.getByLabelText(/short note/i);
  await user.type(observationTextarea, "Adding a new observation");

  expect(screen.getByRole("status")).toBeEmptyDOMElement();
});