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
  Director: string;
  Picture: string;
  Year: string;
  Category: string;
  MovieId: string;
  TitleId: string;
  Days: EventDay[];
}

interface EventDay {
  Performances: EventDayPerformance[];
  Day: string;
}

interface EventDayPerformance {
  PerformanceId: number;
  Time: string;
  Screen: string;
  ScreenId: number;
  StartTime: string;
  EndTime: string;
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

  return (
    <div className='Event'>
      <img
        src={`${config.baseUrl}/angwt/${event.Picture}`}
        alt='Locandina'
        className='poster' />
      <div className='content'>
        <h1 className='title'>{event.Title}</h1>
        <div className='info'>
          <p className='year'>{event.Year}</p>
          <p className='category'>{event.Category.toLowerCase()}</p>
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
                undefined,
                {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  timeZone: 'Europe/Rome',
                },
              ).format;

              const formatTime = Intl.DateTimeFormat(
                undefined,
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Europe/Rome',
                },
              ).format;

              return (
                <div key={day.Day} className='day'>
                  <p>{formatDate(date)}</p>
                  <div className='performances'>
                    {
                      day.Performances.map((performance) => {
                        const startTime = new Date(performance.StartTime);

                        return (
                          <span key={performance.PerformanceId}>
                            {formatTime(startTime)}
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
        <p className='description'>{event.Description}</p>
        <Link href={purchaseUrl} target='_blank' className='button'>
          Acquista il tuo biglietto
        </Link>
      </div>
    </div>
  );
}
