  $(document).ready(function () {
    // Cria ou substitui o cookie 'conv.otimized' com valor 1 e expiração de 30 dias
    Cookies.set('conv.otimized', 1, { expires: 30, path: '/' });

    // Função para extrair o valor do parâmetro gclid da URL
    function getGclidFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('gclid');
    }

    // Função para gerar um UUID aleatório
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    // Extrai o gclid da URL
    const gclid = getGclidFromUrl();
    // Gera um UUID aleatório
    const randomUser = generateUUID();

    // Se o gclid foi encontrado, armazena-o em um cookie
    if (gclid) {
      Cookies.set('src', gclid, { expires: 30, path: '/' });
      Cookies.set('gclid_user', gclid, { expires: 30, path: '/' });
    }

    // Armazena o UUID gerado em um cookie
    Cookies.set('random_user', randomUser, { expires: 30, path: '/' });

    // Adiciona o valor do cookie 'src' ao final das URLs com a classe "utm_tracker"
    $('.utm_tracker').each(function () {
      const currentHref = $(this).attr('href');
      const srcValue = Cookies.get('src');
      if (srcValue) {
        // Adiciona o parâmetro src ao final da URL
        const separator = currentHref.includes('?') ? '&' : '?';
        $(this).attr('href', currentHref + separator + 'src=' + encodeURIComponent(srcValue));
      }
    });
  });