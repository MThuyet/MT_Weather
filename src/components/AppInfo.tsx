import AppHeader from './AppHeader';
import Lottie from 'lottie-react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import '../styles/app-info.scss';
import sunrise from '../assets/jsonIcon/more/sunrise.json';
import sunset from '../assets/jsonIcon/more/sunset.json';
import humidity from '../assets/jsonIcon/more/humidity.json';
import pressure from '../assets/jsonIcon/more/pressure.json';
import windSpeed from '../assets/jsonIcon/more/windSpeed.json';
import windGust from '../assets/jsonIcon/more/windGust.json';
import visibility from '../assets/jsonIcon/more/visibility.json';
import cloudCover from '../assets/jsonIcon/more/cloudCover.json';
import windDirection from '../assets/jsonIcon/more/windDirection.json';
import isLoading from '../assets/jsonIcon/more/isLoading.json';
import isError from '../assets/jsonIcon/more/isError.json';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Clear from '../assets/jsonIcon/main/Clear.json';
import Clouds from '../assets/jsonIcon/main/Clouds.json';
import Rain from '../assets/jsonIcon/main/Rain.json';
import Ash from '../assets/jsonIcon/main/Ash.json';
import Squall from '../assets/jsonIcon/main/Squall.json';
import Drizzle from '../assets/jsonIcon/main/Drizzle.json';
import Thunderstorm from '../assets/jsonIcon/main/Thunderstorm.json';
import Snow from '../assets/jsonIcon/main/Snow.json';
import Mist from '../assets/jsonIcon/main/Mist.json';
import Sand from '../assets/jsonIcon/main/Sand.json';
import Dust from '../assets/jsonIcon/main/Dust.json';
import Fog from '../assets/jsonIcon/main/Fog.json';
import Haze from '../assets/jsonIcon/main/Haze.json';
import Smoke from '../assets/jsonIcon/main/Smoke.json';
import { useTranslation } from 'react-i18next';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const weatherIconMain = {
  Clear: Clear,
  Clouds: Clouds,
  Rain: Rain,
  Drizzle: Drizzle,
  Thunderstorm: Thunderstorm,
  Snow: Snow,
  Mist: Mist,
  Ash: Ash,
  Squall: Squall,
  Sand: Sand,
  Dust: Dust,
  Fog: Fog,
  Haze: Haze,
  Smoke: Smoke,
};

type TWeatherIcon = (typeof weatherIconMain)[keyof typeof weatherIconMain];

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  dt: number;
  timezone: number;
}

const AppInfo = () => {
  const { t } = useTranslation();
  const [valueSearch, setValueSearch] = useState<string>('');
  const [unitTemp, setUnitTemp] = useState<'C' | 'F'>('C');
  const [valueTemp, setValueTemp] = useState<number | null>(null);
  const body = document.querySelector('body');
  const [mainIcon, setMainIcon] = useState<TWeatherIcon>(Clear);

  const fetchWeather = async (city: string) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city === '' ? 'Ho Chi Minh' : city}&appid=${API_KEY}&units=metric`,
    );
    if (!res.ok) throw new Error('Something went wrong');
    return res.json();
  };

  const {
    isPending,
    error,
    data: weather,
  } = useQuery<WeatherData>({
    queryKey: ['fetchDataWeather', valueSearch],
    queryFn: () => fetchWeather(valueSearch),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  const renderTooltip = (value: string) => <Tooltip>{t(value)}</Tooltip>;

  useEffect(() => {
    if (!weather) return;
    const tempCelsius = weather.main.temp;
    setValueTemp(unitTemp === 'C' ? tempCelsius : tempCelsius * 1.8 + 32);
  }, [weather, unitTemp]);

  useEffect(() => {
    if (!weather) return;
    const mainWeather = weather.weather[0]?.main;
    if (body && mainWeather && mainWeather in weatherIconMain) {
      body.style.background = `url('/assets/images/weather/${mainWeather}.jpg') center/cover no-repeat`;
      setMainIcon(weatherIconMain[mainWeather as keyof typeof weatherIconMain]);
    }
  }, [weather]);

  const handleChangeTemp = () => {
    if (weather) {
      const tempCelsius = weather.main.temp;
      if (unitTemp === 'C') {
        setUnitTemp('F');
        setValueTemp(tempCelsius * 1.8 + 32);
      } else {
        setUnitTemp('C');
        setValueTemp(tempCelsius);
      }
    }
  };

  return (
    <div className="weather-container">
      <AppHeader setValueSearch={setValueSearch} />
      <Row className="justify-content-between">
        {isPending && (
          <div className="loading">
            <Lottie animationData={isLoading} />
          </div>
        )}

        {weather && (
          <>
            <Col md={6} xs={24} sm={24}>
              <div className="main">
                <Lottie className="lottie" animationData={mainIcon} />
                <h2 className="main-location">
                  <span className="time">
                    <span style={{ opacity: '0.8', letterSpacing: '1px' }}>{new Date(weather.dt * 1000).toISOString().split('T')[0]}</span>
                  </span>
                  <span>
                    {' '}
                    {weather.name}, {weather.sys.country}
                  </span>
                </h2>
                <div className="main-info">
                  <div className="item">
                    <span className="title">{t('weather')}</span>
                    <span className="content">{t(weather.weather[0].main)}</span>
                  </div>

                  <div className="item">
                    <span className="title">{t('description')}</span>
                    <span className="content">{t(weather.weather[0].description)}</span>
                  </div>

                  <OverlayTrigger key="temperature-tooltip" placement="top" overlay={renderTooltip('clickToChangeTemp')}>
                    <div className="item change" onClick={handleChangeTemp}>
                      <span className="title">{t('temperature')}</span>
                      <span className="content">
                        {valueTemp?.toFixed(1)} °{unitTemp}
                      </span>
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </Col>

            <Col md={6} xs={24} sm={24}>
              <div className="more">
                <div className="list-more">
                  <div className="list-item">
                    <OverlayTrigger key="sunrise-tooltip" placement="top" overlay={renderTooltip('sunrise')}>
                      <div className="item">
                        <Lottie className="lottie" animationData={sunrise} />
                        <span>{new Date((weather.sys.sunrise + weather.timezone) * 1000).toUTCString().split(' ')[4]}</span>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger key="sunset-tooltip" placement="top" overlay={renderTooltip('sunset')}>
                      <div className="item">
                        <Lottie className="lottie" animationData={sunset} />
                        <span>{new Date((weather.sys.sunset + weather.timezone) * 1000).toUTCString().split(' ')[4]}</span>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger key="humidity-tooltip" placement="top" overlay={renderTooltip('humidity')}>
                      <div className="item">
                        <Lottie className="lottie" animationData={humidity} />
                        <span>{weather.main.humidity} %</span>
                      </div>
                    </OverlayTrigger>
                  </div>

                  <div className="list-item">
                    <OverlayTrigger key="pressure-tooltip" placement="top" overlay={renderTooltip('pressure')}>
                      <div className="item">
                        <Lottie className="lottie" animationData={pressure} />
                        <span>{weather.main.pressure} hPa</span>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger key="windSpeed-tooltip" placement="top" overlay={renderTooltip('windSpeed')}>
                      <div className="item">
                        <Lottie className="lottie" animationData={windSpeed} />
                        <span>{weather.wind.speed} m/s</span>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger key="windGust-tooltip" placement="top" overlay={renderTooltip('windGust')}>
                      <div className="item">
                        <Lottie style={{ height: '60px' }} className="lottie" animationData={windGust} />
                        <span>{weather.wind.gust ?? 'N/A'} m/s</span>
                      </div>
                    </OverlayTrigger>
                  </div>

                  <div className="list-item">
                    <OverlayTrigger key="cloudCover-tooltip" placement="top" overlay={renderTooltip('cloudCover')}>
                      <div className="item">
                        <Lottie style={{ width: '50%', height: '60px' }} className="lottie cloud-cover" animationData={cloudCover} />
                        <span>{weather.clouds.all} %</span>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger key="visibility-tooltip" placement="top" overlay={renderTooltip('visibility')}>
                      <div className="item">
                        <Lottie className="lottie" animationData={visibility} />
                        <span>{weather.visibility} m</span>
                      </div>
                    </OverlayTrigger>

                    <OverlayTrigger key="windDirection-tooltip" placement="top" overlay={renderTooltip('windDirection')}>
                      <div className="item">
                        <Lottie className="lottie" animationData={windDirection} />
                        <span>{weather.wind.deg} °</span>
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            </Col>
          </>
        )}

        {error && (
          <div className="error">
            <Lottie style={{ width: '50%', height: '50%' }} animationData={isError} />
            <span>{error.message === 'Something went wrong' ? t('locationNotFound') : t('somethingWentWrong')}</span>
          </div>
        )}
      </Row>
    </div>
  );
};

export default AppInfo;
