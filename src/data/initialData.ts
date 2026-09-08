import { LearningTrack, TopicGroup, UserProfile } from '../types';

export const INITIAL_TOPICS: TopicGroup[] = [
  {
    id: 'topic-1',
    title: 'ТЕМА 1: Основы Java (Практическая работа №1)',
    tasks: [
      {
        id: 't1-1',
        title: 'Типы данных (примитивные: int, double, boolean и др.)',
        completed: false,
        createdAt: 1710000000001,
      },
      {
        id: 't1-2',
        title: 'Арифметические операции и приоритеты',
        completed: false,
        createdAt: 1710000000002,
      },
      {
        id: 't1-3',
        title: 'Условные конструкции (if-else, switch)',
        completed: false,
        createdAt: 1710000000003,
      },
      {
        id: 't1-4',
        title: 'Циклы (for, while, do-while)',
        completed: false,
        createdAt: 1710000000004,
      },
      {
        id: 't1-5',
        title: 'Ввод/вывод данных (Scanner, System.out.println)',
        completed: false,
        createdAt: 1710000000005,
      },
    ],
  },
  {
    id: 'topic-2',
    title: 'ТЕМА 2: Классы, объекты и инкапсуляция (Практическая работа №2)',
    tasks: [
      {
        id: 't2-1',
        title: 'Понятие класса и объекта (экземпляра)',
        completed: false,
        createdAt: 1710000000006,
      },
      {
        id: 't2-2',
        title: 'Конструкторы (по умолчанию, с параметрами, перегрузка)',
        completed: false,
        createdAt: 1710000000007,
      },
      {
        id: 't2-3',
        title: 'Модификаторы доступа (public, private, protected, default)',
        completed: false,
        createdAt: 1710000000008,
      },
      {
        id: 't2-4',
        title: 'Инкапсуляция (геттеры и сеттеры — getters/setters)',
        completed: false,
        createdAt: 1710000000009,
      },
    ],
  },
  {
    id: 'topic-3',
    title: 'ТЕМА 3: Наследование, абстрактные классы и интерфейсы (Практическая работа №3)',
    tasks: [
      {
        id: 't3-1',
        title: 'Наследование (`extends`, ключевое слово `super`)',
        completed: false,
        createdAt: 1710000000010,
      },
      {
        id: 't3-2',
        title: 'Абстрактные классы и методы (`abstract`)',
        completed: false,
        createdAt: 1710000000011,
      },
      {
        id: 't3-3',
        title: 'Интерфейсы (`implements`, константы в интерфейсах, множественная реализация)',
        completed: false,
        createdAt: 1710000000012,
      },
      {
        id: 't3-4',
        title: 'Полиморфизм (работа с объектами через ссылки на родительский класс/интерфейс)',
        completed: false,
        createdAt: 1710000000013,
      },
    ],
  },
];

export const INITIAL_TRACKS: LearningTrack[] = [
  {
    id: 'track-java',
    title: 'Изучение Java',
    category: 'Backend & Core',
    description: 'Основы синтаксиса, объектно-ориентированное программирование, классы и наследование',
    topics: INITIAL_TOPICS,
    createdAt: 1710000000000,
  },
  {
    id: 'track-javascript',
    title: 'Изучение JavaScript',
    category: 'Frontend & Web',
    description: 'Современный синтаксис ES6+, работа с браузерным DOM, асинхронность и Fetch API',
    topics: [
      {
        id: 'js-topic-1',
        title: 'ТЕМА 1: Основы синтаксиса JavaScript (ES6+)',
        tasks: [
          { id: 'jst-1', title: 'Переменные let, const и области видимости', completed: false, createdAt: 1710000000101 },
          { id: 'jst-2', title: 'Типы данных и приведение типов', completed: false, createdAt: 1710000000102 },
          { id: 'jst-3', title: 'Стрелочные функции и параметры по умолчанию', completed: false, createdAt: 1710000000103 },
          { id: 'jst-4', title: 'Массивы и методы перебора (map, filter, reduce)', completed: false, createdAt: 1710000000104 },
        ],
      },
      {
        id: 'js-topic-2',
        title: 'ТЕМА 2: DOM-дерево и работа с событиями',
        tasks: [
          { id: 'jst-5', title: 'Поиск элементов (querySelector, getElementById)', completed: false, createdAt: 1710000000105 },
          { id: 'jst-6', title: 'Слушатели событий addEventListener и всплытие', completed: false, createdAt: 1710000000106 },
          { id: 'jst-7', title: 'Динамическое изменение стилей и классов', completed: false, createdAt: 1710000000107 },
        ],
      },
      {
        id: 'js-topic-3',
        title: 'ТЕМА 3: Асинхронность и работа с сетью',
        tasks: [
          { id: 'jst-8', title: 'Event Loop и очереди микротасок', completed: false, createdAt: 1710000000108 },
          { id: 'jst-9', title: 'Promise и синтаксис async / await', completed: false, createdAt: 1710000000109 },
          { id: 'jst-10', title: 'Отправка HTTP-запросов через Fetch API', completed: false, createdAt: 1710000000110 },
        ],
      },
    ],
    createdAt: 1710000000100,
  },
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Студент',
  role: 'Junior Developer',
  avatar: null,
  joinedAt: Date.now(),
};

