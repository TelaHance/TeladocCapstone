import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../../../main/Components/Nav/LoginButton";
jest.mock("@auth0/auth0-react");
describe("Login Button tests", () => {
    beforeEach(() => {
        useAuth0.mockReturnValue({
            loginWithRedirect: jest.fn(),
        });
    });
    test("it renders without crashing", () => {
        const { getByText } = render(<LoginButton />);
        const button = getByText(/Log In/);
        expect(button).toBeInTheDocument();
    });

    test("it calls the redirect function when clicked", () => {
        const loginWithRedirectSpy = jest.fn();
        useAuth0.mockReturnValueOnce({
            loginWithRedirect: loginWithRedirectSpy,
        });
        render(<LoginButton />);

        userEvent.click(screen.getByText(/Log In/));
        expect(loginWithRedirectSpy).toHaveBeenCalledTimes(1);
    });
});
