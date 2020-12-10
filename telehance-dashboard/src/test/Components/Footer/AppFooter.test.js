import React from "react";
import { render } from "@testing-library/react";
import AppFooter from "../../../main/Components/Footer/AppFooter";

describe("AppFooter tests", () => {
    test("renders without crashing", () => {
        render(<AppFooter />);
    });
});
