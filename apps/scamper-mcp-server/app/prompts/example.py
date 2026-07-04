def reframe_problem(problem: str) -> str:
    """Generate a prompt asking an LLM to reframe a problem using all SCAMPER categories."""
    return (
        "Apply the SCAMPER checklist (Substitute, Combine, Adapt, Modify, "
        "Put to another use, Eliminate, Reverse) to reframe the following "
        f"problem and propose one alternative angle per category:\n\n{problem}"
    )
