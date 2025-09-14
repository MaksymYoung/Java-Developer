## Для запуска auth-service в Docker нужно:

- Запустить docker desktop
- Перейти в папку `auth-service/`
- Создать контейнер командой `docker build -t auth-service .`
- Запустить контейнер на порте 9080 командой
  `docker run -p 9080:9080 auth-service`
- обязательно запускать gateway 