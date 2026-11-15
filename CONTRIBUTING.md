# Contributing to Cosmic Rescue

Thank you for contributing to **Cosmic Rescue: The Little Space War**.

## How to contribute

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Test locally:
   ```bash
   npm install
   npm run dev
   npm run build
   ```
5. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: short description of your change"
   ```
6. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a pull request.

## Contribution guidelines

- Keep the game original; do not add copyrighted characters, assets, music, or UI.
- Use React functional components and hooks.
- Keep game rules in `src/data` and `src/engine`.
- Keep UI components in `src/components`.
- Test the full gameplay loop before submitting.
- Ensure `npm run build` passes.
- Clearly attribute any NASA data, imagery, or external resources used.

