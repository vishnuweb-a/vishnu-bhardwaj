# Features Directory

Feature-oriented architecture. Each feature should contain its own:

- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks
- `services/` - Feature-specific services
- `utils/` - Feature-specific utilities
- `pages/` - Feature pages (if applicable)
- `index.js` - Barrel export

Example structure:

```
features/
└── authentication/
    ├── components/
    ├── hooks/
    ├── services/
    ├── utils/
    ├── pages/
    └── index.js
```

Do NOT put business-specific logic in generic `components/` directory.
