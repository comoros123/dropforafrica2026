import json
from pathlib import Path

TOURS_FILE = Path('data/tours.json')

DEFAULT_TOURS = [
    {
        'name': 'Wild Migration Explorer',
        'tagline': 'Witness the Great Migration in unmatched comfort',
        'details': 'Experience the iconic river crossings, private guides, and premium tented camps in Kenya and Tanzania.'
    },
    {
        'name': 'Coastal Bliss Retreat',
        'tagline': 'Luxury beach escapes on Africa’s finest shores',
        'details': 'Relax in white-sand villas, enjoy fresh seafood, and explore hidden coastal villages.'
    },
    {
        'name': 'Cultural Heritage Journey',
        'tagline': 'Connect with timeless traditions and local stories',
        'details': 'Meet Maasai communities, discover coastal markets, and taste authentic regional cuisine.'
    },
    {
        'name': 'Luxury Safari Escape',
        'tagline': 'High-end wildlife experiences designed your way',
        'details': 'Stay in acclaimed lodges, enjoy private game drives, and travel between destinations in style.'
    }
]


def load_tours():
    if TOURS_FILE.exists():
        return json.loads(TOURS_FILE.read_text())
    return DEFAULT_TOURS


def generate_marketing_copy(tours):
    hero = 'Drop for Africa creates polished journeys through East Africa — from epic wildlife safaris to barefoot beach retreats.'
    sections = [
        'We blend modern luxury with local authenticity so every traveler feels inspired from arrival to departure.',
        'Our itineraries are carefully curated to highlight the best of Maasai Mara, Amboseli, Tsavo, Naivasha, Watamu, Serengeti and Ngorongoro.',
    ]
    tour_lines = []
    for tour in tours:
        tour_lines.append(f"- {tour['name']}: {tour['tagline']} — {tour['details']}")

    return '\n'.join([hero, *sections, '', 'Featured experiences:', *tour_lines])


def main():
    tours = load_tours()
    print(generate_marketing_copy(tours))


if __name__ == '__main__':
    main()
