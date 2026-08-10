import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { EventProvider } from "../context/EventContext";
import EventCard from "../components/EventCard";

const mockEvent = {
  id: "1",
  title: "React Workshop",
  description: "Learn React Hooks",
  start: "2026-08-05T10:00:00",
  end: "2026-08-05T12:00:00",
  color: "#2563eb",
};

describe("EventCard Component", () => {
  test("renders event title", () => {
    render(
      <BrowserRouter>
        <EventProvider>
          <EventCard
            event={mockEvent}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </EventProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("React Workshop")).toBeInTheDocument();
  });

  test("renders event description", () => {
    render(
      <BrowserRouter>
        <EventProvider>
          <EventCard
            event={mockEvent}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </EventProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("Learn React Hooks")).toBeInTheDocument();
  });

  test("calls edit handler", async () => {
    const user = userEvent.setup();
    const handleEdit = jest.fn();

    render(
      <BrowserRouter>
        <EventProvider>
          <EventCard
            event={mockEvent}
            onEdit={handleEdit}
            onDelete={() => {}}
          />
        </EventProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  test("calls delete handler", async () => {
    const user = userEvent.setup();
    const handleDelete = jest.fn();

    render(
      <BrowserRouter>
        <EventProvider>
          <EventCard
            event={mockEvent}
            onEdit={() => {}}
            onDelete={handleDelete}
          />
        </EventProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
}
);