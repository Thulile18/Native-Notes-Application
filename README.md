# Native Notes Application

React Native notes app built with Expo Router and AsyncStorage.

## Features
- Register, login and logout (passwords are hashed with SHA-256)
- Protected routes (logged in users cannot see login/register)
- Update profile (username, email, password)
- Notes in Work, Study and Personal tabs
- Add, view, edit (with edited timestamp) and delete notes
- Search by words and sort by date added

## Folders
- app/  = screens (routing)
- src/  = components, constants, context, styles, types, utils

## Run
1. npm install
2. npx expo install --fix   (matches package versions to your Expo version)
3. npx expo start
