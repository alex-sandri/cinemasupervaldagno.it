import Link from 'next/link';
import '../styles/globals.css';

const config = {
  localId: 5415,
  trackId: 33,
  baseUrl: 'https://secure.webtic.it',
} as const;

interface Event {
  EventId: number;
  Title: string;
  Description: string;
  Actors: string;
  Director: string;
  Picture: string;
  Year: string;
  Category: string;
  MovieId: string;
  Days: EventDay[];
}

interface EventDay {
  Performances: EventDayPerformance[];
  Day: string;
}

interface EventDayPerformance {
  PerformanceId: number;
  Time: string;
  Duration: number;
}

async function getEvents(): Promise<Event[]> {
  const response = await fetch(
    `${config.baseUrl}/api/wtjsonservices.ashx?localid=${config.localId}&trackid=${config.trackId}&wtid=getFullScheduling`,
    { cache: 'no-store' },
  ).then(res => res.json());

  return response.DS.Scheduling.Events;
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div>
      <header>
        <img src='logo.jpg' alt='Logo' className='logo' />
        <div>
          <h1 className='title'>Cinema Super Valdagno</h1>
          <p className='info'>
            <Link href='https://goo.gl/maps/XxisXghAnxi8wbsz8' target='_blank'>
              <span>Viale Trento, 28</span>
            </Link>
            <span> &bull; </span>
            <Link href='tel:+390445401909'>
              <span>0445 401909</span>
            </Link>
          </p>
        </div>
      </header>
      <main>
        {
          events.map((event) => {
            return <Event key={event.EventId} event={event} />
          })
        }
      </main>
    </div>
  );
}

function Event({ event }: { event: Event }) {
  const purchaseUrl = `${config.baseUrl}/angwt/webtic.aspx?pu=aHR0cHM6Ly93d3cud2VidGljLml0LyMvc2hvcHBpbmc/YWN0aW9uPWxvYWRMb2NhbCZsb2NhbElkPTU0MTU=&rnd=0.9282734738010057&lng=it&lid=${config.localId}&tpl=blue&lvs=bnVsbA==&kid=${config.trackId}#/event/it/${config.trackId}/${config.localId}/${event.EventId}`;

  const formatDuration = (duration: number) => {
    const hours = Math.trunc(duration / 60);
    const minutes = duration % 60;

    const parts = [];

    if (hours > 0) {
      parts.push(`${hours}h`);
    }

    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }

    return parts.join(' ');
  };

  return (
    <div className='Event'>
      <div className="side">
        <img
          src={`${config.baseUrl}/angwt/${event.Picture}`}
          alt='Locandina'
          className='poster' />
        <div className='side-info'>
          <p className='director'>
            <span>Regia</span>
            <span className='capitalize'>{event.Director.toLowerCase()}</span>
          </p>
          {
            event.Actors.trim().length > 0 &&
              <p className='actors'>
                <span>Attori</span>
                {event.Actors}
              </p>
          }
          <p className='duration'>
            <span>Durata</span>
            {formatDuration(event.Days[0].Performances[0].Duration)}
          </p>
        </div>
      </div>
      <div className='content'>
        <h1 className='title'>{event.Title}</h1>
        <div className='info'>
          <p className='year'>{event.Year}</p>
          <p className='category capitalize'>{event.Category.toLowerCase()}</p>
          {
            event.MovieId.trim().length > 0
              ? <Link href={event.MovieId} target='_blank' className='button'>
                  <span className='trailer'>Guarda il trailer</span>
                </Link>
              : null
          }
        </div>
        <div className='days'>
          {
            event.Days.map((day) => {
              const date = new Date(day.Day);

              const formatDate = Intl.DateTimeFormat(
                'it-IT',
                {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                },
              ).format;

              return (
                <div key={day.Day} className='day'>
                  <p>{formatDate(date)}</p>
                  <div className='performances'>
                    {
                      day.Performances.map((performance) => {
                        return (
                          <span key={performance.PerformanceId}>
                            {performance.Time}
                          </span>
                        );
                      })
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
        <p className='description'>
          {
            event.Description
              .replaceAll('\\"', '"')
              .replaceAll('\\r\\n', '\n')
              .trim()
          }
        </p>
        <Link href={purchaseUrl} target='_blank' className='button'>
          Acquista il tuo biglietto
        </Link>
      </div>
    </div>
  );
}
