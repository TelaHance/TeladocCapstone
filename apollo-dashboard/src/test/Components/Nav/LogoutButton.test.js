import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
jest.mock("@auth0/auth0-react");
import userEvent from "@testing-library/user-event";
import LogoutButton from "../../../main/Components/Nav/LogoutButton";

describe("logout button tests", () => {
    beforeEach(() => {
        const logoutSpy = jest.fn();
        useAuth0.mockReturnValue({
            logout: logoutSpy,
        });
    });
    test("it renders without crashing", () => {
        render(<LogoutButton />);
    });

    test("it invokes logout when the button is clicked", () => {
        const logoutSpy = jest.fn();
        useAuth0.mockReturnValueOnce({
            logout: logoutSpy,
        });
        render(<LogoutButton />);
        userEvent.click(screen.getByText(/Log Out/));
        expect(logoutSpy).toHaveBeenCalledTimes(1);
    });
});
