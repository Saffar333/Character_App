# Настройка Supabase Storage для загрузки аватаров

## Шаг 1: Создание Storage Bucket

1. Открой свой проект в [Supabase Dashboard](https://supabase.com/dashboard)
2. В левом меню выбери **Storage**
3. Нажми **Create a new bucket**
4. Заполни форму:
   - **Name**: `character-avatars`
   - **Public bucket**: ✅ **Включено** (важно!)
   - **File size limit**: 5 MB (по умолчанию)
   - **Allowed MIME types**: оставь пустым (будет проверяться на клиенте)
5. Нажми **Create bucket**

## Шаг 2: Настройка политик доступа (RLS)

После создания bucket нужно настроить права доступа:

1. Открой созданный bucket `character-avatars`
2. Перейди на вкладку **Policies**
3. Нажми **New Policy**

### Политика 1: Публичное чтение

```sql
-- Название: Public Read Access
-- Разрешить: SELECT
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'character-avatars' );
```

### Политика 2: Загрузка файлов

```sql
-- Название: Authenticated Upload
-- Разрешить: INSERT
CREATE POLICY "Authenticated can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'character-avatars' );
```

### Политика 3: Обновление файлов

```sql
-- Название: Authenticated Update
-- Разрешить: UPDATE
CREATE POLICY "Authenticated can update avatars"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'character-avatars' )
WITH CHECK ( bucket_id = 'character-avatars' );
```

### Политика 4: Удаление файлов

```sql
-- Название: Authenticated Delete
-- Разрешить: DELETE
CREATE POLICY "Authenticated can delete avatars"
ON storage.objects FOR DELETE
USING ( bucket_id = 'character-avatars' );
```

## Шаг 3: Проверка настроек

После настройки политик проверь:

1. ✅ Bucket `character-avatars` создан
2. ✅ Public bucket = ON
3. ✅ Все 4 политики добавлены

## Структура URL для загруженных файлов

После загрузки файлы будут доступны по URL:

```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/character-avatars/avatar_[timestamp]_[random].[ext]
```

Пример:
```
https://dxniagaevxtyexumfpsi.supabase.co/storage/v1/object/public/character-avatars/avatar_1699999999_abc123.jpg
```

## Тестирование

1. Открой http://localhost:8080/create/index.html
2. Нажми **Выбрать фото**
3. Выбери изображение (JPG, PNG или WEBP, до 5 МБ)
4. Увидишь сообщение **✅ Фото выбрано** и превью аватара
5. Заполни форму и нажми **Создать персонажа**
6. Фото загрузится в Supabase Storage автоматически

## Возможные ошибки

### ❌ "Ошибка загрузки фото: Bucket not found"
**Решение**: Создай bucket с именем `character-avatars` (см. Шаг 1)

### ❌ "Нет доступа. Проверьте настройки bucket"
**Решение**: Проверь, что bucket публичный и добавлены политики RLS (см. Шаг 2)

### ❌ "Failed to fetch"
**Решение**: Проверь, что Supabase URL и ANON KEY правильные в `config.js`

## Альтернатива: Быстрая настройка через SQL

Если хочешь настроить всё одной командой, выполни этот SQL в Supabase SQL Editor:

```sql
-- Создание bucket (если нужно через SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-avatars', 'character-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Политики доступа
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING ( bucket_id = 'character-avatars' );

CREATE POLICY "Authenticated can upload avatars" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'character-avatars' );

CREATE POLICY "Authenticated can update avatars" ON storage.objects
FOR UPDATE USING ( bucket_id = 'character-avatars' )
WITH CHECK ( bucket_id = 'character-avatars' );

CREATE POLICY "Authenticated can delete avatars" ON storage.objects
FOR DELETE USING ( bucket_id = 'character-avatars' );
```
