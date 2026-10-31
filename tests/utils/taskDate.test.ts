import { formatDueDate, isOverdue } from "@/utils/taskDate"

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

describe("formatDueDate", () => {
  it("formats a date string without timezone shifts", () => {
    expect(formatDueDate("2026-06-01")).toContain("2026")
    expect(formatDueDate("2026-06-01")).toContain("1")
  })
})
