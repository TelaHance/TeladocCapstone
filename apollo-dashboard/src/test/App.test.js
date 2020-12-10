import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "../main/App";
import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
jest.mock("@auth0/auth0-react");
jest.mock("swr");

describe("App tests", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenSilently: jest.fn(),
    });
    useSWR.mockReturnValue({
      data: {
        role: "guest"
      }
    });
  });

  test("renders without crashing", () => {
    const history = createMemoryHistory();
    const { getByTestId } = render(
        <Router history={history}>
          <App />
        </Router>
    );
    const brand = getByTestId("brand");
    expect(brand).toBeInTheDocument();
  });

  test("renders loading when loading", () => {
    useAuth0.mockReturnValueOnce({
      ...useAuth0(),
      isLoading: true,
    });
    const { getByAltText } = render(<App />);
    const loading = getByAltText("Loading");
    expect(loading).toBeInTheDocument();
  });
});
