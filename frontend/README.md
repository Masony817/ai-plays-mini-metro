# Mini Metro Infused - Frontend

## Project Structure

```
frontend/
├── src/                    # Source files
│   ├── js/                # JavaScript files
│   │   └── app.js         # Main application JS
│   ├── css/               # CSS source files
│   │   └── input.css      # Tailwind CSS input file
│   └── assets/            # Static assets
│       └── game-icon.webp # Game icon
├── public/                # Public files
│   └── index.html         # Main HTML file
├── dist/                  # Build outputs (auto-generated)
│   └── styles.css         # Compiled CSS
├── package.json           # NPM configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## Development

### Install Dependencies
```bash
npm install
```

### Available Scripts

- `npm run dev` - Start development server with CSS watch mode
- `npm run build` - Build CSS for production
- `npm run build-css` - Build CSS with watch mode
- `npm run serve` - Start simple HTTP server
- `npm start` - Build CSS and start server

### Development Workflow

1. Run `npm run dev` to start development with auto CSS rebuilding
2. Edit files in the `src/` directory
3. The CSS will automatically rebuild when you save changes
4. Access your app at `http://localhost:8080`

## Styling

This project uses **Tailwind CSS** for styling:

- Source CSS: `src/css/input.css`
- Built CSS: `dist/styles.css` (don't edit directly)
- Config: `tailwind.config.js`

### Custom Classes Available

- `.app-container` - Main app layout
- `.game-container` - Game area styling
- `.game-title` - Title styling

### Custom Colors

- `bg-game-bg` / `text-game-bg` - Light gray background (#f0f0f0)
- `text-game-primary` - Dark text (#333)

## Adding New Features

1. **JavaScript**: Add files to `src/js/`
2. **CSS**: Edit `src/css/input.css` or add new CSS files
3. **Assets**: Place in `src/assets/`
4. **HTML**: Edit `public/index.html`

Remember to update paths in HTML when adding new files!