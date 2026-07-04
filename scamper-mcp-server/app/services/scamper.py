import random
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class ScamperCategory:
    id: str
    name: str
    description: str
    questions: list[str]
    examples: list[str]


_CATEGORIES: list[ScamperCategory] = [
    ScamperCategory(
        id="S",
        name="Substitute",
        description="Replace a part, material, process, place, or person involved in the problem with something else.",
        questions=[
            "What materials, ingredients, or components could be substituted?",
            "What other process or procedure could be used instead?",
            "What if this happened at a different place or time?",
            "Who else could be involved instead of the current people?",
            "What rule, approach, or algorithm could replace the current one?",
        ],
        examples=[
            "Replacing sugar with a sweetener in food products",
            "Substituting plastic packaging with biodegradable material",
            "Using a synchronous meeting instead of an async status update",
        ],
    ),
    ScamperCategory(
        id="C",
        name="Combine",
        description="Merge the problem, product, or process with another idea, feature, or resource to create something new.",
        questions=[
            "What ideas, materials, or features could be combined?",
            "Can this be merged with another product or service to add value?",
            "What would happen if we combined this with its opposite?",
            "Can two steps in the process be merged into one?",
            "What complementary purposes could be combined here?",
        ],
        examples=[
            "A printer-scanner-copier combo device",
            "A phone that is also a camera and a music player",
            "Combining a gym membership with a coffee shop loyalty program",
        ],
    ),
    ScamperCategory(
        id="A",
        name="Adapt",
        description="Adjust or adapt an existing idea, product, or solution from another context to fit this problem.",
        questions=[
            "What else is like this? What other solution could be adapted?",
            "What ideas from other industries could apply here?",
            "What could be copied or borrowed from nature or history?",
            "How could this idea be adapted for a different audience?",
            "What context could this be adapted to work in?",
        ],
        examples=[
            "Velcro adapted from burrs sticking to fur",
            "Adapting airline check-in kiosks for hotel check-in",
            "Adapting a subscription model from software to razors",
        ],
    ),
    ScamperCategory(
        id="M",
        name="Modify (Magnify / Minify)",
        description="Change the size, shape, attributes, or intensity of the product or process — make it bigger, smaller, or altered.",
        questions=[
            "What could be exaggerated, magnified, or made stronger?",
            "What could be minimized, simplified, or made lighter?",
            "What attribute (color, shape, sound, meaning) could be changed?",
            "What if the frequency or duration were changed?",
            "What if this were made more or less extreme?",
        ],
        examples=[
            "Travel-size toiletries (minify)",
            "Big-screen smartphones (magnify)",
            "Adding extra features to a basic product to make a premium version",
        ],
    ),
    ScamperCategory(
        id="P",
        name="Put to another use",
        description="Consider new ways to use the product or idea, or how it could serve a different purpose or audience.",
        questions=[
            "Who else could use this, and how?",
            "What other markets or contexts could this serve?",
            "Can this be used differently if slightly modified?",
            "What new use emerges if we ignore the original purpose?",
            "What by-product or waste could become useful elsewhere?",
        ],
        examples=[
            "Baking soda used as a cleaning agent instead of just for baking",
            "Bubble wrap repurposed from wallpaper to packaging material",
            "Old shipping containers repurposed as housing",
        ],
    ),
    ScamperCategory(
        id="E",
        name="Eliminate",
        description="Remove elements, steps, or features to simplify the product, process, or problem down to its essentials.",
        questions=[
            "What could be removed or eliminated without losing core value?",
            "What if this were simplified or streamlined?",
            "What steps in the process are redundant?",
            "What rules or constraints could be dropped?",
            "What would the minimal viable version look like?",
        ],
        examples=[
            "Removing the steering wheel in a fully autonomous car concept",
            "Cutting unnecessary approval steps from a workflow",
            "No-frills airlines eliminating free amenities to cut cost",
        ],
    ),
    ScamperCategory(
        id="R",
        name="Reverse (Rearrange)",
        description="Reverse the order, roles, or logic of the process, or rearrange its components in a different sequence.",
        questions=[
            "What if the order of steps were reversed?",
            "What if roles were swapped (e.g., customer and provider)?",
            "What would happen if we did the opposite of the current approach?",
            "Can components be rearranged into a different layout or sequence?",
            "What if the cause and effect were flipped?",
        ],
        examples=[
            "Pay-what-you-want pricing reversing the usual price-setting role",
            "Assembling furniture in reverse to diagnose a defect",
            "Reversing the sales funnel by letting the customer come to the seller",
        ],
    ),
]


class ScamperStore:
    """In-memory lookup over the fixed SCAMPER checklist."""

    def __init__(self) -> None:
        self._by_id = {c.id: c for c in _CATEGORIES}
        self._by_name = {c.name.lower(): c for c in _CATEGORIES}

    def list_categories(self) -> list[ScamperCategory]:
        return list(_CATEGORIES)

    def get_category(self, key: str) -> ScamperCategory:
        key_norm = key.strip()
        if key_norm.upper() in self._by_id:
            return self._by_id[key_norm.upper()]
        if key_norm.lower() in self._by_name:
            return self._by_name[key_norm.lower()]
        raise KeyError(f"Unknown SCAMPER category: {key!r}")

    def search_prompts(self, query: str, top_k: int = 5) -> list[tuple[ScamperCategory, str]]:
        query_lower = query.lower()
        matches: list[tuple[ScamperCategory, str]] = []
        for category in _CATEGORIES:
            haystacks = [category.description, *category.questions, *category.examples]
            for text in haystacks:
                if query_lower in text.lower():
                    matches.append((category, text))
        return matches[:top_k]

    def random_prompts(self, count: int = 5) -> list[tuple[ScamperCategory, str]]:
        pool = [(c, q) for c in _CATEGORIES for q in c.questions]
        return random.sample(pool, k=min(count, len(pool)))


@lru_cache(maxsize=1)
def get_store() -> ScamperStore:
    return ScamperStore()
