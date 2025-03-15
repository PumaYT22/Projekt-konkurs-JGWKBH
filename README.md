# Projekt-konkurs-JGWKBH

Dokumentacja instalacji i uruchomienia projektu konkursowego JGWKBH.

## Spis treści
- [Wymagania wstępne](#wymagania-wstępne)
- [Instalacja i uruchomienie frontendu](#instalacja-i-uruchomienie-frontendu)
- [Uruchomienie backendu](#uruchomienie-backendu)
- [Konfiguracja serwera SI (Ollama)](#konfiguracja-serwera-si)
- [Struktura projektu](#struktura-projektu)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## Wymagania wstępne

Przed rozpoczęciem instalacji upewnij się, że masz zainstalowane:

- [Node.js](https://nodejs.org/) (zalecana wersja LTS)
- [Visual Studio Code](https://code.visualstudio.com/) lub inny edytor kodu
- Przeglądarka internetowa (Chrome, Firefox, Edge)

## Instalacja i uruchomienie frontendu

1. Pobierz repozytorium projektu "Projekt-konkurs-JGWKBH" i umieść je w wybranym folderze:

```bash
git clone https://github.com/username/Projekt-konkurs-JGWKBH.git
```

2. Otwórz folder projektu w Visual Studio Code

3. Otwórz nowy terminal (Ctrl+Shift+`)

4. Przejdź do folderu z aplikacją frontendową:

```bash
cd Projekt-konkurs-JGWKBH
cd front
cd apka
```

5. Zainstaluj wymagane zależności:

```bash
npm install tailwindcss @tailwindcss/vite
npm i react-router-dom
npm i
```

6. Uruchom aplikację w trybie deweloperskim:

```bash
npm run dev
```

7. Otwórz przeglądarkę i przejdź pod adres podany w terminalu (zwykle `http://localhost:5173/`)

![Widok aplikacji frontendowej](https://github.com/user-attachments/assets/6215dd22-1ac5-49a2-9e10-eba93224e549)

## Uruchomienie backendu

1. Otwórz nowy terminal w Visual Studio Code, pozostawiając uruchomiony frontend

2. Przejdź do folderu backendu:

```bash
cd Projekt-konkurs-JGWKBH
cd backend
```

3. Zainstaluj narzędzie nodemon (do automatycznego restartu serwera):

```bash
npm i nodemon
```

4. Utwórz plik konfiguracyjny `.env` w folderze backend:

```
ACCESS_TOKEN_SECRET=ssdaads
```

> **Ważne**: Plik `.env` zawiera klucze potrzebne do zabezpieczenia aplikacji. W środowisku produkcyjnym należy użyć bardziej złożonego klucza.

5. Uruchom serwer backendu:

```bash
npm run start
```

Poprawne uruchomienie powinno być potwierdzone komunikatem w terminalu.

## Konfiguracja serwera SI

Projekt wykorzystuje Ollama jako lokalny serwer SI do przetwarzania danych.

1. Pobierz i zainstaluj Ollama ze strony [https://ollama.com/download](https://ollama.com/download)

![Strona pobierania Ollama](https://github.com/user-attachments/assets/6215dd22-1ac5-49a2-9e10-eba93224e549)

2. Po instalacji uruchom aplikację Ollama

3. Opcjonalnie: zainstaluj i skonfiguruj dodatkowe modele SI według potrzeb projektu:

```bash
ollama run deepseek-r1:8b
```

## Struktura projektu

```
Projekt-konkurs-JGWKBH/
├── front/
│   └── apka/
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── ...
├── backend/
│   ├── .env
│   ├── package.json
│   └── ...
└── README.md
```

## Rozwiązywanie problemów

### Problem z połączeniem do backendu
- Upewnij się, że backend działa na prawidłowym porcie
- Sprawdź, czy plik `.env` jest poprawnie skonfigurowany

### Problem z uruchomieniem frontendu
- Upewnij się, że wszystkie zależności zostały zainstalowane (`npm i`)
- Sprawdź logi błędów w konsoli terminala

### Problem z Ollama
- Sprawdź, czy Ollama została poprawnie zainstalowana
- Upewnij się, że aplikacja jest uruchomiona w tle

---

W przypadku innych problemów, odwiedź [repozytorium projektu](https://github.com/username/Projekt-konkurs-JGWKBH/issues) lub skontaktuj się z autorami.
