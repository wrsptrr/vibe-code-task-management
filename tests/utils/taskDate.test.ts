import { formatDueDate, isOverdue, toDateTimeInputValue } from "@/utils/taskDate"

const now = new Date(2026, 5, 15, 12, 0, 0)

describe("isOverdue", () => {
  it("is true when the due date is in the past", () => {
    expect(isOverdue({ dueDate: "2026-06-14", status: "todo" }, now)).toBe(true)
  })

  it("is false when due today", () => {
    expect(isOverdue({ dueDate: "2026-06-15", status: "todo" }, now)).toBe(false)
  })

  it("is false when due in the future", () => {
    expect(isOverdue({ dueDate: "2026-06-16", status: "todo" }, now)).toBe(false)
  })

  it("is false when the task is done", () => {
    expect(isOverdue({ dueDate: "2026-06-01", status: "done" }, now)).toBe(false)
  })

  it("is false without a due date", () => {
    expect(isOverdue({ status: "todo" }, now)).toBe(false)
  })
})

describe("isOverdue with time", () => {
  it("is true one minute after the due time", () => {
    expect(
      isOverdue({ dueDate: "2026-06-15T11:59", status: "todo" }, now),
    ).toBe(true)
  })

  it("is false exactly at the due time", () => {
    expect(
      isOverdue({ dueDate: "2026-06-15T12:00", status: "todo" }, now),
    ).toBe(false)
  })

  it("is false later the same day", () => {
    expect(
      isOverdue({ dueDate: "2026-06-15T18:30", status: "todo" }, now),
    ).toBe(false)
  })

  it("is true when the date has passed regardless of time", () => {
    expect(
      isOverdue({ dueDate: "2026-06-14T23:59", status: "todo" }, now),
    ).toBe(true)
  })

  it("is false when done", () => {
    expect(
      isOverdue({ dueDate: "2026-06-01T08:00", status: "done" }, now),
    ).toBe(false)
  })
})

describe("formatDueDate", () => {
  it("appends the time when present", () => {
    expect(formatDueDate("2026-06-01T14:30")).toMatch(/, 14\.30$/)
  })

  it("omits the time for date-only values", () => {
    expect(formatDueDate("2026-06-01")).not.toContain(",")
  })

  it("formats a date string without timezone shifts", () => {
    expect(formatDueDate("2026-06-01")).toContain("2026")
    expect(formatDueDate("2026-06-01")).toContain("1")
  })
})

describe("toDateTimeInputValue", () => {
  it("returns an empty string without a due date", () => {
    expect(toDateTimeInputValue(undefined)).toBe("")
  })

  it("keeps values that already have a time", () => {
    expect(toDateTimeInputValue("2026-06-01T14:30")).toBe("2026-06-01T14:30")
  })

  it("adds midnight to legacy date-only values", () => {
    expect(toDateTimeInputValue("2026-06-01")).toBe("2026-06-01T00:00")
  })
})
