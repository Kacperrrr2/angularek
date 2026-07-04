from app.services.scamper import get_store

# ---------------------------------------------------------------------------
# Data / retrieval tools
# ---------------------------------------------------------------------------


def list_scamper_categories() -> str:
    """List all seven SCAMPER categories with a short description of each."""
    store = get_store()
    categories = store.list_categories()
    output = f"{len(categories)} SCAMPER categories:\n\n"
    for c in categories:
        output += f"• [{c.id}] {c.name}\n  {c.description}\n\n"
    return output.strip()


def get_scamper_category(category: str) -> str:
    """Retrieve full detail (description, guiding questions, examples) for one SCAMPER category by its letter (S/C/A/M/P/E/R) or name."""
    try:
        store = get_store()
        c = store.get_category(category)
        output = f"[{c.id}] {c.name}\n\n{c.description}\n\n"
        output += "Guiding questions:\n" + "\n".join(f"• {q}" for q in c.questions) + "\n\n"
        output += "Examples:\n" + "\n".join(f"• {e}" for e in c.examples)
        return output.strip()
    except KeyError as e:
        return str(e)


def search_scamper_prompts(query: str, limit: int = 5) -> str:
    """Search SCAMPER guiding questions and examples for a keyword or phrase."""
    store = get_store()
    results = store.search_prompts(query, top_k=limit)
    if not results:
        return "No matching SCAMPER prompts found."
    output = f"Found {len(results)} match(es):\n\n"
    for category, text in results:
        output += f"• [{category.id}] {category.name}: {text}\n"
    return output.strip()


def get_random_scamper_prompts(limit: int = 5) -> str:
    """Return a random selection of SCAMPER guiding questions to spark ideation."""
    store = get_store()
    results = store.random_prompts(count=limit)
    if not results:
        return "No prompts found."
    output = f"{len(results)} random SCAMPER prompt(s):\n\n"
    for category, question in results:
        output += f"• [{category.id}] {category.name}: {question}\n"
    return output.strip()


# ---------------------------------------------------------------------------
# Problem redefinition
# ---------------------------------------------------------------------------


def generate_scamper_questions(problem: str, categories: list[str] | None = None) -> str:
    """Redefine a problem statement by generating SCAMPER guiding questions applied to it.

    Args:
        problem: A short description of the problem, product, or process to reframe.
        categories: Optional subset of SCAMPER category letters/names to use
            (e.g. ["S", "Eliminate"]). Defaults to all seven categories.
    """
    store = get_store()
    try:
        selected = (
            [store.get_category(c) for c in categories]
            if categories
            else store.list_categories()
        )
    except KeyError as e:
        return str(e)

    output = f'SCAMPER reframing of the problem: "{problem}"\n\n'
    for c in selected:
        output += f"[{c.id}] {c.name}\n"
        for q in c.questions:
            output += f"  • {q.rstrip('?')} — in the context of: {problem}?\n"
        output += "\n"
    return output.strip()
