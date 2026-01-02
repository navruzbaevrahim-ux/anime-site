# Anime Site (Demo)

Это простой HTML/CSS/JS проект — демо-каталог аниме.

Как запустить локально:
1. Клонируйте репозиторий:
   git clone https://github.com/navruzbaevrahim-ux/anime-site.git
2. Перейдите в папку:
   cd anime-site
3. Запустите статический сервер (через npx):
   npx http-server . -p 8080
   или
   npx live-server

Откройте http://localhost:8080 в браузере.

Что я рекомендую далее:
- Подключить реальные данные из JSON/API.
- Оптимизировать изображения (WebP, адаптивные srcset).
- Настроить CI: htmlhint и автопроверки PR.
- Вынести сборку/минификацию (если планируете продакшен).
