const urlFather = 'https://icanhazdadjoke.com/';
const dataFather = {
  method: 'GET',
  headers: {
    // eslint-disable-next-line prettier/prettier
    Accept: 'application/json',
  },
};

const urlChuck = 'https://api.chucknorris.io/jokes/random';
const dataChuck = {
  method: 'GET',
};

const urlWeather =
  'https://api.openweathermap.org/data/2.5/weather?lat=41.390205&lon=2.154007&appid=e1cfeb1205be92eb55ed83ac48a3a40c&units=metric';
const dataWeather = {
  method: 'GET',
};

let allowVoting = false;

const reportAcudits: Scores = [];

const fetching = async <T>(url: string, data: RequestInit = {}): Promise<T> => {
  return await fetch(url, data)
    .then(response => response.json())
    .then(data => data as T);
};

const getFather = async (): Promise<void> => {
  const joke: JokeFather = await fetching(urlFather, dataFather);
  const jokeDiv = <HTMLDivElement>document.getElementById('joke');
  jokeDiv.innerHTML = joke.joke;
};

const getChuck = async (): Promise<void> => {
  const joke: JokeChuck = await fetching(urlChuck, dataChuck);
  const jokeDiv = <HTMLDivElement>document.getElementById('joke');
  jokeDiv.innerHTML = joke.value;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWeather = async (): Promise<void> => {
  const weather: Weather = await fetching(urlWeather, dataWeather);
  console.log(weather);
  const weatherDiv = <HTMLDivElement>document.getElementById('weather');
  const weatherIconDiv = <HTMLDivElement>(
    document.getElementById('weather-icon')
  );
  weatherDiv.innerHTML = `${weather.main.temp} ºC`;
  weatherIconDiv.innerHTML = `<img src ="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Sol y nubes" />`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getJoke = (): void => {
  permitReevaluation('');
  const seed: number = Math.round(Math.random());
  seed ? getFather() : getChuck();
  if (allowVoting === false) {
    allowVoting = true;
    const vote = <HTMLDivElement>document.getElementById('voting');
    vote.classList.remove('d-none');
  }
};

const permitReevaluation = (date: string) => {
  const votingButton: Array<HTMLElement> = Array.from(
    document.querySelectorAll('#voting .btn')
  );
  votingButton.map(e =>
    date === ''
      ? (e.onclick = () => evaluateJoke(e.innerHTML))
      : (e.onclick = () => evaluateJoke(e.innerHTML, date))
  );
};

const evaluateJoke = (points: string, date = ''): void => {
  if (date === '') {
    const jokeDiv = <HTMLDivElement>document.getElementById('joke');
    const sc: Score = {
      joke: jokeDiv.innerHTML,
      score: points,
      date: new Date().toISOString(),
    };
    permitReevaluation(sc.date);
    reportAcudits.push(sc);
  } else {
    reportAcudits.filter(s => {
      if (s.date === date) s.score = points;
      console.log(`Changed: new score is ${s.score}`);
    });
  }
  console.log(reportAcudits);
};

window.addEventListener('load', async () => {
  console.log('load');
  await getWeather();
});

// TYPES DEFINITIONS

type JokeFather = {
  id: string;
  joke: string;
  status: Number;
};

type JokeChuck = {
  icon_url: string;
  id: string;
  url: string;
  value: string;
};

type Score = {
  joke: string;
  score: string;
  date: string;
};

type Scores = Array<Score>;

// Only the needed fields are modelated
type Weather = {
  weather: WeatherEntity[];
  main: Main;
};

type WeatherEntity = {
  icon: string;
};

type Main = {
  temp: number;
};
