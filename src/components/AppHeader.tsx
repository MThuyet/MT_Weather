import { Dropdown, DropdownItem, DropdownMenu } from 'react-bootstrap';
import iconUSA from '../assets/images/language/united-states-of-america.png';
import iconVn from '../assets/images/language/vietnam.png';
import { IoSearchOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';

interface IProps {
  setValueSearch: (value: string) => void;
}

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
  local_names?: { [key: string]: string };
}

const AppHeader = (props: IProps) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(iconUSA);
  const { setValueSearch } = props;
  const [inputSearch, setInputSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState<{ name: string; country: string }[]>([]);
  const [debouncedInput] = useDebounce(inputSearch, 500);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchDataSearch = async (input: string): Promise<City[]> => {
    if (input.length > 1) {
      const urlAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`;
      const res = await fetch(urlAPI);
      if (!res.ok) throw new Error('Something went wrong');
      return res.json();
    }
    return [];
  };

  const { data } = useQuery({
    queryKey: ['fetchDataSearch', debouncedInput],
    queryFn: () => fetchDataSearch(debouncedInput),
    refetchOnWindowFocus: false,
    enabled: debouncedInput.length > 1,
  });

  const getSuggestions = (data: City[] | undefined) => {
    if (!data) return [];
    return data.map((item: City) => ({
      name: item.name,
      country: item.country,
    }));
  };

  useEffect(() => {
    if (debouncedInput.length > 1) {
      setSuggestions(getSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [debouncedInput, data]);

  const handleSearch = () => {
    const trimmedInput = inputSearch.trim();
    if (trimmedInput) {
      setValueSearch(trimmedInput);
      setInputSearch('');
      setSuggestions([]);
    } else {
      toast.error(t('Please enter a city name'));
      setInputSearch('');
    }
  };

  const changeLanguage = (lng: string, icon: string) => {
    i18n.changeLanguage(lng);
    setLanguage(icon);
    toast.success(t('Change language successfully'));
  };
  return (
    <>
      <div className="header">
        <h3 className="title">MT Weather</h3>
        <div className="search">
          <input
            id="search"
            value={inputSearch}
            aria-label={t('searchPlaceholder')}
            onChange={(e) => setInputSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            type="text"
            placeholder={t('searchPlaceholder')}
          />

          <IoSearchOutline aria-label="Search" className="icon" onClick={() => handleSearch()} />

          <ul className="suggestions">
            {suggestions &&
              suggestions.length > 0 &&
              suggestions.map((item) => {
                return (
                  <li
                    key={`${item.name}-${item.country}`}
                    onClick={() => {
                      setValueSearch(item.name);
                      setSuggestions([]);
                      setInputSearch('');
                    }}>
                    {item.name}, {item.country}
                  </li>
                );
              })}
          </ul>
        </div>

        <Dropdown>
          <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }}>
            <img className="icon-language" src={language} alt="" />
          </Dropdown.Toggle>

          <DropdownMenu>
            <DropdownItem onClick={() => changeLanguage('en', iconUSA)}>
              English <img className="icon-language" src={iconUSA} alt="" />
            </DropdownItem>
            <DropdownItem onClick={() => changeLanguage('vi', iconVn)}>
              Tiếng Việt <img className="icon-language" src={iconVn} alt="" />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export default AppHeader;
