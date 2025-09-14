## Для запуска фронтенда в Docker нужно:

- Запустить docker desktop
- Перейти в папку `frontend/`
- Создать контейнер командой `docker build -t symetime/facebook-deply-front:ver1.0 .`
- Запустить контейнер на порте 5137 командой 
`docker run -p 5173:80 symetime/facebook-deply-front:ver1.0`