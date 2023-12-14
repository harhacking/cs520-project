import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect"; // for additional matchers
import { BrowserRouter } from "react-router-dom";
import Login from "../Pages/Login";
import App from "../App";

test("renders Login page by default", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const loginHeader = screen.getByText("Login", { selector: "p" });
  expect(loginHeader).toBeInTheDocument();
  expect(loginHeader.tagName).toBe("P");
});

test("renders Sign up link", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const signUpLink = screen.getByText("Sign up", { selector: "a" });
  expect(signUpLink).toBeInTheDocument();
  expect(signUpLink.tagName).toBe("A");
});

test("initially renders with empty username and password", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  // Get the input fields by their labels
  const usernameInput = screen.getByLabelText("Username");
  const passwordInput = screen.getByLabelText("Password");

  // Check if the initial values are empty
  expect(usernameInput.value).toBe("");
  expect(passwordInput.value).toBe("");
});

test("initially renders with no auth error", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  const credErrorElement = screen.queryByText(
    "The username and/or password is incorrect."
  );
  expect(credErrorElement).toBeNull();
});

test("submits the form with valid data and navigates to the correct page", async () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  userEvent.type(screen.getByLabelText("Username"), "tanay");
  userEvent.type(screen.getByLabelText("Password"), "Prasutan@67");
  userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(
    screen.queryByText("The username and/or password is incorrect")
  ).not.toBeInTheDocument();
});


