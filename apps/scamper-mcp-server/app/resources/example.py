from app.services.scamper import get_store


def read_category(category: str) -> str:
    """Read the full detail for a SCAMPER category as a resource."""
    try:
        store = get_store()
        c = store.get_category(category)
    except KeyError as e:
        return str(e)
    return f"[{c.id}] {c.name}\n\n{c.description}"
