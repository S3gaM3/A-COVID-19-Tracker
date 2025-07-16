# ⚡ Быстрый деплой на GitHub Pages

## 🚀 Команды для деплоя (5 минут)

### 1. Подготовка
```bash
git add .
git commit -m "Готов к деплою"
git push origin main
```

### 2. Настройка GitHub Pages
1. GitHub → Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Save

### 3. Проверка
- Actions → Deploy to GitHub Pages → ✅
- Сайт: https://s3gam3.github.io/A-COVID-19-Tracker

## 📋 Чек-лист

- [ ] Все файлы в git
- [ ] Push в main ветку
- [ ] GitHub Pages настроены
- [ ] Actions запустились
- [ ] Сайт работает

## 🔄 Автообновления

После настройки просто:
```bash
git add .
git commit -m "Обновление"
git push origin main
```

**Сайт обновится автоматически! 🎉** 