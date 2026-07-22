// ============================
// CATÁLOGO DE HQs da DC Comics
// ============================
console.log("CATÁLOGO DC CARREGADO");
const catalogoDC = [

    {
    // =====================================================
    // IDENTIFICAÇÃO
    // =====================================================

    // ID único da revista.
    // Nunca repetir.
    // Também é usado em favoritos, biblioteca, buscas etc.
    id: "supergirl-001",


    // Aparece no Hero da página inicial?
    hero: true,


    // Título exibido no site.
    titulo: "Supergirl #001",


    // Data em que ESTA HQ foi adicionada ao site.
    // Usado em Últimas Adições.
    dataAdicao: "2026-07-21",


    // Editora responsável.
    // Mesmo que não apareça na página da HQ,
    // continua útil para filtros e organização.
    editoraId: "dc",


    // Coleção/Série da HQ.
    // Liga automaticamente com a página da coleção.
    colecaoId: "supergirl-serie-principal",



    // =====================================================
    // INFORMAÇÕES DA REVISTA
    // =====================================================

    // Classificação indicativa.
    classificacao: "14",


    // Volume da publicação.
    volume: "VI",


    // Número da edição.
    edicao: "001",


    // Ano de publicação.
    ano: "2026",


    // Formato do arquivo.
    formato: "CBR",



    // =====================================================
    // IMAGENS
    // =====================================================

    // Poster usado na página da postagem e no card do index no Top 10.
    capa: "https://image.tmdb.org/t/p/original/8hxJr7ctrLEvHuiD20JJJ0EpMlJ.jpg",


    // Capa alternativa para os cards do Últimas adições, TEXTLESS.
    capaCard: "https://image.tmdb.org/t/p/original/rBMyqPVc5lB4vlNbN9tfTtvhIro.jpg",


    // Banner do Hero/Slide.
    heroImagem: "https://image.tmdb.org/t/p/original/vjo6eGHMvssJaRheGxfYakLutc.jpg",


    // Logo PNG separado.
    logo: "https://image.tmdb.org/t/p/original/kTguAz4fmRdZPS3diTRdPj4xamr.png",



    // =====================================================
    // CONTROLE DOS LOGOS
    // =====================================================

    // Mostrar logo separado no Hero/Slide?
    mostrarLogoHero: false,


    // Mostrar logo separado em Últimas Adições?
    //
    // Quando TRUE:
    // usa capa limpa + logo PNG.
    //
    // Quando FALSE:
    // usa apenas a própria capa.
    mostrarLogoCard: true,


    // Mostrar logo separado dentro da página da HQ?
    mostrarLogoPost: false,



    // =====================================================
    // SELO
    // =====================================================

    // Pequena faixa vermelha sobre a capa.
    // Exemplos:
    //
    // Vol. VI
    // Especial
    // Deluxe
    // Nova Série
    selo: "Deluxe",



    // =====================================================
    // LINKS
    // =====================================================

    // Caminho da página da HQ.
    pagina: "hqs/dc/supergirl/supergirl-001.html",


    // Link do download.
    //
    // Depois poderá ser Google Drive,
    // Mega, Pixeldrain etc.
    download: "#",



    // =====================================================
    // INFORMAÇÕES TÉCNICAS
    // =====================================================

    // Esse bloco alimentará o novo
    // card técnico da página da HQ.
    informacoes: {

        // Nome original da publicação.
        tituloOriginal: "Supergirl",

        // Data completa de lançamento.
        dataLancamento: "25 de junho de 2026",

        // Tamanho do arquivo.
        tamanho: "21 MB",

        // Servidor onde está hospedado.
        servidor: "Proton Drive",

        // Idioma.
        idioma: "Português",

        // Gênero.
        genero: "Ação, Aventura e Ficção científica",

        // Número de páginas.
        paginas: "25"

    },



    // =====================================================
    // CRÉDITOS
    // =====================================================

    // Segunda coluna do novo card.
    creditos: {

        autor: "Ana Nogueira",

        desenhista: "Jerry Siegel",

        colorista: "Joe Shuster",

        tradutor: "",

        distribuicao: "Craig Gillespie"

    },



    // =====================================================
    // TEXTO CURTO
    // =====================================================

    // Resumo mostrado na página da HQ.
    sinopse: `
    Verdade. Justiça. Tanto Faz.
    
    Kara Zor-El comemora seu aniversário de 21 anos viajando pela galáxia com seu cachorro Krypto. Ao longo do caminho, ela conhece a jovem Ruthye Marye Knoll e se depara com uma tragédia que a leva a uma “busca assassina por vingança".
    `,



    // =====================================================
    // TEXTO COMPLETO
    // =====================================================

    // Descrição completa da edição.
    descricaoCompleta: `
    Verdade. Justiça. Tanto Faz.
    
    Kara Zor-El comemora seu aniversário de 21 anos viajando pela galáxia com seu cachorro Krypto. Ao longo do caminho, ela conhece a jovem Ruthye Marye Knoll e se depara com uma tragédia que a leva a uma “busca assassina por vingança".
    `

    },










];


