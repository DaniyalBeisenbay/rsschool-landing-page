const themeSwitch = document.querySelector('.theme-switch');

if (themeSwitch) {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    const isDark = document.body.classList.contains('dark-theme');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}