import { Flight, formatDuration } from '@seat-finder/shared';

interface Props {
  flight: Flight;
}

export default function FlightCard({ flight }: Props) {
  const depTime = new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const arrTime = new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const stopsLabel = flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;

  return (
    <div className="flight-card">
      <div className="flight-card-info">
        <h3>{flight.airline} &middot; {flight.flightNumber}</h3>
        <div className="flight-meta">{flight.cabinClass.charAt(0).toUpperCase() + flight.cabinClass.slice(1)} &middot; {stopsLabel}</div>
        <div className="flight-times">
          {depTime} &rarr; {arrTime} &middot; {formatDuration(flight.durationMinutes)}
        </div>
        {flight.availableSeats.length > 0 && (
          <div className="seat-tags">
            {flight.availableSeats.slice(0, 4).map(seat => (
              <span key={seat.seatNumber} className="seat-tag">
                {seat.seatNumber} ({seat.position}{seat.features.length ? `, ${seat.features.join(', ')}` : ''})
              </span>
            ))}
            {flight.availableSeats.length > 4 && (
              <span className="seat-tag">+{flight.availableSeats.length - 4} more</span>
            )}
          </div>
        )}
      </div>
      <div className="flight-card-price">
        <div className="price">${flight.price}</div>
        <div className="stops">{stopsLabel}</div>
      </div>
    </div>
  );
}
