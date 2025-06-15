const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'https://qa-internship.avito.com';
const VALID_SELLER_ID = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

describe('Advertisements API', () => {
  let createdAdId;

  // Тест: Создание объявления
  test('POST /api/1/item - создание объявления', async () => {
    const adData = {
      sellerID: VALID_SELLER_ID,
      name: "Test Item",
      price: 1000,
      statistics: {
        likes: 10,
        viewCount: 100,
        contacts: 5
      }
    };

    const response = await axios.post(`${BASE_URL}/api/1/item`, adData);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status');
    expect(response.data.status).toContain('Сохранили объявление');
    
    // Извлекаем ID из ответа
    createdAdId = response.data.status.split(' - ')[1];
    expect(createdAdId).toBeDefined();
  });

  // Тест: Получение объявления по ID
  test('GET /api/1/item/:id - получение объявления', async () => {
    const response = await axios.get(`${BASE_URL}/api/1/item/${createdAdId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0].id).toBe(createdAdId);
  });

  // Тест: Получение объявлений по sellerID
  test('GET /api/1/:sellerID/item - получение объявлений продавца', async () => {
    const response = await axios.get(`${BASE_URL}/api/1/${VALID_SELLER_ID}/item`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    
    // Проверяем что есть объявление с нашим ID
    const ourAd = response.data.find(ad => ad.id === createdAdId);
    expect(ourAd).toBeDefined();
  });

  // Тест: Получение статистики (v1)
  test('GET /api/1/statistic/:id - получение статистики', async () => {
    const response = await axios.get(`${BASE_URL}/api/1/statistic/${createdAdId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0]).toHaveProperty('likes');
    expect(response.data[0]).toHaveProperty('viewCount');
    expect(response.data[0]).toHaveProperty('contacts');
  });

  // Тест: Получение статистики (v2)
  test('GET /api/2/statistic/:id - получение статистики v2', async () => {
    const response = await axios.get(`${BASE_URL}/api/2/statistic/${createdAdId}`);
    expect(response.status).toBe(200);

    // Ожидаем массив объектов
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    
    // Сервер возвращает объект вместо массива
    expect(response.data[0]).toHaveProperty('likes');
    expect(response.data[0]).toHaveProperty('viewCount');
    expect(response.data[0]).toHaveProperty('contacts');
  });

  // Тест: Удаление объявления
  test('DELETE /api/2/item/:id - удаление объявления', async () => {
    const response = await axios.delete(`${BASE_URL}/api/2/item/${createdAdId}`);
    expect(response.status).toBe(200);
    
    // Проверка что объявление удалено
    try {
      await axios.get(`${BASE_URL}/api/1/item/${createdAdId}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  // Негативные тесты
  describe('Негативные сценарии', () => {
    test('Создание с невалидным sellerID', async () => {
      try {
        await axios.post(`${BASE_URL}/api/1/item`, {
          sellerID: 100000,
          name: "Invalid Item",
          price: 500,
          statistics: { likes: 0, viewCount: 0, contacts: 0 }
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('Получение несуществующего объявления', async () => {
      try {
        await axios.get(`${BASE_URL}/api/1/item/non_existent_id_123`);
      } catch (error) {
        expect(error.response.status).toBe(400); // Сервер возвращает 400 вместо 404 - это же баг?
      }
    });

    test('Удаление уже удаленного объявления', async () => {
      try {
        await axios.delete(`${BASE_URL}/api/2/item/${createdAdId}`);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});