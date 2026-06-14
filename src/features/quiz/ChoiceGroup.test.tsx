import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { ChoiceGroup } from "./ChoiceGroup"

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
]

describe("ChoiceGroup", () => {
  it("rend la légende et un bouton radio par option", () => {
    render(
      <ChoiceGroup legend="Ma question" options={options} value={undefined} onChange={() => {}} idPrefix="q1" />,
    )
    expect(screen.getByText("Ma question")).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("appelle onChange avec la value de l'option cliquée", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ChoiceGroup legend="Ma question" options={options} value={undefined} onChange={onChange} idPrefix="q1" />,
    )
    await user.click(screen.getAllByRole("radio")[1])
    expect(onChange).toHaveBeenCalledWith("b")
  })

  it("reflète la pré-sélection fournie via value", () => {
    render(
      <ChoiceGroup legend="Ma question" options={options} value="c" onChange={() => {}} idPrefix="q1" />,
    )
    expect(screen.getAllByRole("radio")[2]).toHaveAttribute("aria-checked", "true")
  })
})
