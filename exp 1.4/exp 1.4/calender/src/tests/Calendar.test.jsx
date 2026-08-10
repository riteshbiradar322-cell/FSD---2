import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { EventProvider } from "../context/EventContext";
import Calendar from "../components/Calendar";

describe("Calendar Component", () => {
  test("renders calendar", () => {
    render(
      <BrowserRouter>
        <EventProvider>
          <Calendar />
        </EventProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/today/i)).toBeInTheDocument();
  });

  test("renders month button", () => {
    render(
      <BrowserRouter>
        <EventProvider>
          <Calendar />
        </EventProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/month/i)).toBeInTheDocument();
  });

  test("renders week button", () => {
    render(
      <BrowserRouter>
        <EventProvider>
          <Calendar />
        </EventProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/week/i)).toBeInTheDocument();
  });

  test("renders day button", () => {
    render(
      <BrowserRouter>
        <EventProvider>
          <Calendar />
        </EventProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/day/i)).toBeInTheDocument();
  });
});