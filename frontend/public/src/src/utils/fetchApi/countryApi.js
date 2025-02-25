import { get, post, put, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// CRUD операции для стран

// Получение списка стран
export const getCountries = async (params = {}) => {
    return get(ENDPOINTS.COUNTRIES, params);
};

// Получение одной страны по ID
export const getCountryById = async (countryId) => {
    return get(ENDPOINTS.COUNTRY_DETAIL(countryId));
};

// Создание страны
export const createCountry = async (countryData) => {
    return post(ENDPOINTS.CREATE_COUNTRY, countryData);
};

// Обновление страны
export const updateCountry = async (countryId, countryData) => {
    return put(ENDPOINTS.UPDATE_COUNTRY(countryId), countryData);
};

// Удаление страны
export const deleteCountry = async (countryId) => {
    return remove(ENDPOINTS.DELETE_COUNTRY(countryId));
};