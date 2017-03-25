/* global hexo */

hexo.extend.helper.register('is_root', isRoot);
hexo.extend.helper.register('get_langs', getLangs);
hexo.extend.helper.register('switch_lang', switchLang);

function isRoot() {
  return this.page.path === 'index.html';
}

function getLangs() {
  return this.config.language.filter(lang => lang !== 'default');
}

function switchLang(lang) {
  if (typeof lang === 'undefined') return '';
  if (this.is_root()) return this.url_for(lang);
  if (this.page.lang === lang) return '';
  const langReg = new RegExp(`^${this.page.lang}/`);
  if (langReg.test(this.page.path)) {
    return this.url_for(this.page.path.replace(langReg, `${lang}/`));
  }
  return '';
}