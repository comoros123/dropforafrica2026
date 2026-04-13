import json
from pathlib import Path

BOOKINGS_FILE = Path('backend/data/bookings.json')


def load_bookings():
    if not BOOKINGS_FILE.exists():
        return []
    data = json.loads(BOOKINGS_FILE.read_text(encoding='utf-8'))
    return data.get('bookings', [])


def compute_stats(bookings):
    total = len(bookings)
    successful = sum(1 for booking in bookings if booking.get('status') == 'confirmed')
    comments = sum(1 for booking in bookings if booking.get('message'))
    tours = {}
    for booking in bookings:
        tour = booking.get('tour', 'Unspecified')
        tours[tour] = tours.get(tour, 0) + 1
    return {
        'total_bookings': total,
        'successful_bookings': successful,
        'comments': comments,
        'tours': tours,
    }


def main():
    bookings = load_bookings()
    stats = compute_stats(bookings)
    print('Booking analytics summary')
    print('-------------------------')
    print(f"Total bookings: {stats['total_bookings']}")
    print(f"Confirmed bookings: {stats['successful_bookings']}")
    print(f"Comments submitted: {stats['comments']}")
    print('Bookings by tour:')
    for tour, count in stats['tours'].items():
        print(f" - {tour}: {count}")


if __name__ == '__main__':
    main()
