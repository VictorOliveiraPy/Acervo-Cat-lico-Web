import type { Lesson } from "@/lib/academia";
import type { CategorySlug } from "@/lib/schemas";

/**
 * Lições tiradas do Compêndio do Catecismo da Igreja Católica publicado em
 * vatican.va. O texto de cada uma segue a resposta oficial daquele número,
 * adaptada para o português do Brasil; `ccc` são as remissões do próprio Compêndio.
 *
 * Só o que muda de uma lição para outra fica aqui, para acrescentar uma nova ser
 * uma entrada a mais na lista. `build` monta o resto do formato de `Lesson`.
 */
type Entry = {
  n: number;
  ccc: string;
  slug: string;
  module: string;
  title: string;
  question: string;
  text: readonly string[];
  /** Pergunta do exercício, a alternativa certa e as duas erradas. */
  quiz: string;
  right: string;
  wrong: readonly [string, string];
  onWrong: string;
  related: readonly `${CategorySlug}/${string}`[];
};

const REVELATION = "Revelação e fé";
const GOD_AND_MAN = "Deus e o ser humano";
const CHRIST = "Jesus Cristo";
const SPIRIT_CHURCH = "Espírito Santo e Igreja";
const LAST_THINGS = "Realidades últimas";
const SACRAMENTS = "Sacramentos";
const MORAL = "Vida moral";

const ENTRIES: readonly Entry[] = [
  {
    n: 14,
    ccc: "80–82, 97",
    slug: "tradicao-e-escritura",
    module: REVELATION,
    title: "Tradição e Sagrada Escritura",
    question: "Que relação existe entre a Tradição e a Sagrada Escritura?",
    text: [
      "A Tradição e a Sagrada Escritura estão intimamente unidas. Ambas tornam presente e fecundo na Igreja o mistério de Cristo e provêm da mesma fonte divina.",
      "Juntas constituem um só sagrado depósito da fé, do qual a Igreja recebe a certeza sobre todas as coisas reveladas.",
    ],
    quiz: "Como a Tradição e a Sagrada Escritura se relacionam?",
    right: "Estão intimamente unidas e formam um só depósito da fé.",
    wrong: [
      "São fontes rivais, e a Igreja precisa escolher uma delas.",
      "A Escritura vem de Deus, mas a Tradição é só um costume humano.",
    ],
    onWrong:
      "As duas provêm da mesma fonte divina e constituem um só sagrado depósito da fé.",
    related: ["catecismo/transmissao-da-revelacao-divina", "apologetica/sola-scriptura-e-a-tradicao-apostolica"],
  },
  {
    n: 20,
    ccc: "120, 138",
    slug: "canone-das-escrituras",
    module: REVELATION,
    title: "O cânone das Escrituras",
    question: "O que é o cânone das Escrituras?",
    text: [
      "O cânone das Escrituras é a lista completa dos escritos sagrados, que a Tradição Apostólica levou a Igreja a discernir.",
      "Ele compreende 46 escritos do Antigo Testamento e 27 do Novo.",
    ],
    quiz: "Quantos escritos compõem o cânone das Escrituras?",
    right: "46 do Antigo Testamento e 27 do Novo.",
    wrong: ["39 do Antigo Testamento e 27 do Novo.", "46 do Antigo Testamento e 12 do Novo."],
    onWrong: "O cânone compreende 46 escritos do Antigo Testamento e 27 do Novo.",
    related: ["catecismo/a-sagrada-escritura", "crisma/a-sagrada-escritura"],
  },
  {
    n: 27,
    ccc: "150–152, 176–178",
    slug: "o-que-e-crer",
    module: REVELATION,
    title: "O que é crer em Deus",
    question: "O que significa, para o homem, crer em Deus?",
    text: [
      "Significa aderir ao próprio Deus, entregando-se a Ele e dando assentimento a todas as verdades por Ele reveladas, porque Deus é a verdade.",
      "Significa crer num só Deus em três Pessoas: Pai, Filho e Espírito Santo.",
    ],
    quiz: "O que significa crer em Deus?",
    right: "Aderir a Deus, entregando-se a Ele e assentindo às verdades que revelou.",
    wrong: [
      "Apenas admitir que existe algo superior, sem nenhuma consequência.",
      "Ter um sentimento religioso, independentemente do que Deus revelou.",
    ],
    onWrong:
      "Crer é aderir ao próprio Deus e dar assentimento a todas as verdades por Ele reveladas.",
    related: ["virtudes/fe", "catecismo/profissao-da-fe"],
  },
  {
    n: 29,
    ccc: "159",
    slug: "fe-e-ciencia",
    module: REVELATION,
    title: "Fé e ciência",
    question: "Por que não há contradição entre a fé e a ciência?",
    text: [
      "Embora a fé supere a razão, nunca poderá existir contradição entre a fé e a ciência, porque ambas têm origem em Deus.",
      "É o mesmo Deus que dá ao homem tanto a luz da razão como a luz da fé.",
    ],
    quiz: "Por que não pode haver contradição entre a fé e a ciência?",
    right: "Porque ambas têm origem em Deus.",
    wrong: [
      "Porque a fé e a ciência tratam de assuntos que nunca se tocam.",
      "Porque a ciência sempre deve ceder, mesmo quando está certa.",
    ],
    onWrong:
      "É o mesmo Deus que dá a luz da razão e a luz da fé; por isso ambas não podem se contradizer.",
    related: ["ciencia-fe/dei-filius", "documentos-magisterio/humani-generis"],
  },
  {
    n: 35,
    ccc: "193–195",
    slug: "simbolos-da-fe",
    module: REVELATION,
    title: "Os Símbolos da fé",
    question: "Quais são os mais importantes Símbolos da fé?",
    text: [
      "São o Símbolo dos Apóstolos, antigo símbolo batismal da Igreja de Roma, e o Símbolo niceno-constantinopolitano.",
      "Este é fruto dos dois primeiros Concílios Ecumênicos, de Niceia (325) e de Constantinopla (381), e ainda hoje é comum a todas as grandes Igrejas do Oriente e do Ocidente.",
    ],
    quiz: "Quais são os Símbolos da fé mais importantes?",
    right: "O Símbolo dos Apóstolos e o niceno-constantinopolitano.",
    wrong: ["O Pai-Nosso e a Ave-Maria.", "Os Dez Mandamentos e as Bem-aventuranças."],
    onWrong:
      "Os Símbolos são profissões de fé: os principais são o dos Apóstolos e o niceno-constantinopolitano.",
    related: ["catecismo/profissao-da-fe", "oracoes/credo-dos-apostolos"],
  },
  {
    n: 58,
    ccc: "311–314, 324",
    slug: "por-que-deus-permite-o-mal",
    module: GOD_AND_MAN,
    title: "Por que Deus permite o mal",
    question: "Por que Deus permite o mal?",
    text: [
      "A fé nos dá a certeza de que Deus não permitiria o mal se do próprio mal não extraísse o bem.",
      "Foi o que Ele realizou admiravelmente na morte e ressurreição de Cristo: do maior mal moral, a morte de seu Filho, Deus tirou os maiores bens, a glorificação de Cristo e a nossa redenção.",
    ],
    quiz: "O que a fé ensina sobre Deus permitir o mal?",
    right: "Deus não o permitiria se do próprio mal não extraísse o bem.",
    wrong: ["Deus é o causador do mal e o deseja.", "Deus não tem poder sobre o mal."],
    onWrong:
      "A fé dá a certeza de que Deus tira o bem do próprio mal, como na morte e ressurreição de Cristo.",
    related: ["catecismo/a-criacao", "catecismo/livrai-nos-do-mal"],
  },
  {
    n: 60,
    ccc: "328–333, 350–351",
    slug: "os-anjos",
    module: GOD_AND_MAN,
    title: "Os anjos",
    question: "Quem são os anjos?",
    text: [
      "Os anjos são criaturas puramente espirituais, incorpóreas, invisíveis e imortais, seres pessoais dotados de inteligência e de vontade.",
      "Contemplando incessantemente a Deus face a face, eles o glorificam, o servem e são seus mensageiros na missão de salvação de todos os homens.",
    ],
    quiz: "O que são os anjos?",
    right: "Criaturas puramente espirituais, pessoais, com inteligência e vontade.",
    wrong: ["Pessoas boas que morreram e foram para o céu.", "Forças impessoais da natureza."],
    onWrong:
      "Os anjos são criaturas puramente espirituais, invisíveis e imortais; não são pessoas falecidas nem forças impessoais.",
    related: ["anjos-demonios/anjos-na-biblia", "anjos-demonios/queda-dos-anjos"],
  },
  {
    n: 66,
    ccc: "355–358",
    slug: "imagem-de-deus",
    module: GOD_AND_MAN,
    title: "À imagem de Deus",
    question: "Em que sentido o homem é criado à imagem de Deus?",
    text: [
      "Significa que o homem é capaz de conhecer e amar, na liberdade, o próprio Criador. É a única criatura nesta terra que Deus quis por si mesma e chamou a partilhar sua vida divina.",
      "Por isso o homem tem a dignidade de pessoa: não é uma coisa, mas alguém, capaz de se conhecer, de se dar livremente e de entrar em comunhão com Deus e com os outros.",
    ],
    quiz: "O que significa ser criado à imagem de Deus?",
    right: "Ser capaz de conhecer e amar o Criador, com a dignidade de pessoa.",
    wrong: ["Ter um corpo com a mesma aparência física de Deus.", "Ser uma parte da própria substância divina."],
    onWrong:
      "A imagem de Deus está em conhecer e amar o Criador na liberdade; é o que dá ao homem a dignidade de pessoa.",
    related: ["catecismo/o-homem-imagem-de-deus", "doutrina-social/dignidade-da-pessoa-humana"],
  },
  {
    n: 69,
    ccc: "362–368, 382",
    slug: "alma-e-corpo",
    module: GOD_AND_MAN,
    title: "Alma e corpo",
    question: "Como, no homem, a alma e o corpo formam uma unidade?",
    text: [
      "A pessoa humana é um ser ao mesmo tempo corpóreo e espiritual. O espírito e a matéria, no homem, formam uma única natureza.",
      "Essa unidade é tão profunda que, graças à alma, princípio espiritual, o corpo se torna um corpo humano e vivo e participa da dignidade de imagem de Deus.",
    ],
    quiz: "Como a Igreja entende a relação entre alma e corpo?",
    right: "Espírito e matéria formam, no homem, uma única natureza.",
    wrong: ["O corpo é uma prisão da qual a alma precisa fugir.", "A alma é apenas uma função do cérebro."],
    onWrong:
      "O corpo participa da dignidade de imagem de Deus: espírito e matéria formam, no homem, uma única natureza.",
    related: ["catecismo/o-homem-imagem-de-deus"],
  },
  {
    n: 76,
    ccc: "404, 419",
    slug: "pecado-original",
    module: GOD_AND_MAN,
    title: "O pecado original",
    question: "O que é o pecado original?",
    text: [
      "O pecado original, no qual todos os homens nascem, é o estado de privação da santidade e da justiça originais.",
      "É um pecado contraído e não cometido: uma condição de nascimento, não um ato pessoal. A sua transmissão permanece um mistério que não podemos compreender plenamente.",
    ],
    quiz: "O que é o pecado original em cada pessoa?",
    right: "Um estado de privação da santidade e da justiça originais, contraído e não cometido.",
    wrong: [
      "Um ato pessoal que cada um comete na infância.",
      "A má influência dos outros, que aprendemos por imitação.",
    ],
    onWrong:
      "É uma condição de nascimento e não um ato pessoal: um pecado contraído, não cometido.",
    related: ["pecados/pecado-original", "catecismo/queda-e-pecado-original"],
  },
  {
    n: 81,
    ccc: "430–435, 452",
    slug: "o-nome-jesus",
    module: CHRIST,
    title: "O nome de Jesus",
    question: "O que significa o nome Jesus?",
    text: [
      "Dado pelo Anjo no momento da Anunciação, o nome Jesus significa \"Deus salva\".",
      "Ele exprime a sua identidade e a sua missão, \"porque é Ele que salvará o seu povo dos seus pecados\" (Mt 1,21).",
    ],
    quiz: "O que significa o nome Jesus?",
    right: "Deus salva.",
    wrong: ["Ungido.", "Filho do homem."],
    onWrong: "O nome Jesus significa \"Deus salva\". \"Ungido\" é o sentido da palavra Cristo.",
    related: ["jesus-cristo/circuncisao-de-jesus", "arte-sacra-simbolos/ihs"],
  },
  {
    n: 82,
    ccc: "436–440, 453",
    slug: "por-que-cristo",
    module: CHRIST,
    title: "Por que Jesus é chamado Cristo",
    question: "Por que Jesus é chamado Cristo?",
    text: [
      "Cristo, em grego, e Messias, em hebraico, significam \"ungido\". Jesus é o Cristo porque é consagrado por Deus, ungido pelo Espírito Santo para a missão redentora.",
      "Ele é o Messias esperado por Israel, enviado ao mundo pelo Pai. Do nome Cristo veio para nós o nome de cristãos.",
    ],
    quiz: "O que significa a palavra Cristo?",
    right: "Ungido.",
    wrong: ["O sobrenome da família de Jesus.", "Filho de Maria."],
    onWrong: "Cristo, em grego, e Messias, em hebraico, significam \"ungido\"; não é um sobrenome.",
    related: ["catecismo/jesus-cristo-filho-unico-de-deus", "jesus-cristo/verdadeiro-deus-e-verdadeiro-homem"],
  },
  {
    n: 85,
    ccc: "456–460",
    slug: "por-que-deus-se-fez-homem",
    module: CHRIST,
    title: "Por que o Filho de Deus se fez homem",
    question: "Por que o Filho de Deus se fez homem?",
    text: [
      "O Filho de Deus encarnou no seio da Virgem Maria, pelo poder do Espírito Santo, por causa de nós homens e para a nossa salvação.",
      "Ou seja: para nos reconciliar, pecadores, com Deus; para nos fazer conhecer o seu amor infinito; para ser o nosso modelo de santidade; e para nos tornar participantes da natureza divina.",
    ],
    quiz: "Qual destes é um motivo da Encarnação?",
    right: "Reconciliar os pecadores com Deus.",
    wrong: [
      "Dar a Deus uma experiência que lhe faltava.",
      "Fundar um reino político em Israel.",
    ],
    onWrong:
      "O Filho de Deus encarnou por causa de nós e para a nossa salvação, para nos reconciliar com Deus.",
    related: ["catecismo/encarnacao-e-misterios-da-vida-de-cristo", "jesus-cristo/anunciacao-e-encarnacao"],
  },
  {
    n: 87,
    ccc: "464–467, 469",
    slug: "verdadeiro-deus-e-verdadeiro-homem",
    module: CHRIST,
    title: "Verdadeiro Deus e verdadeiro homem",
    question: "De que modo Jesus Cristo é verdadeiro Deus e verdadeiro homem?",
    text: [
      "Jesus é, inseparavelmente, verdadeiro Deus e verdadeiro homem, na unidade da sua Pessoa divina.",
      "Ele, o Filho de Deus, gerado, não criado, consubstancial ao Pai, fez-se verdadeiramente homem, nosso irmão, sem com isso deixar de ser Deus, nosso Senhor.",
    ],
    quiz: "Como a Igreja professa quem é Jesus Cristo?",
    right: "Verdadeiro Deus e verdadeiro homem, na unidade da sua Pessoa divina.",
    wrong: ["Um homem extraordinário, adotado por Deus.", "Deus que apenas parecia ter um corpo humano."],
    onWrong:
      "Jesus é inseparavelmente verdadeiro Deus e verdadeiro homem: fez-se homem sem deixar de ser Deus.",
    related: ["jesus-cristo/verdadeiro-deus-e-verdadeiro-homem", "catecismo/encarnacao-e-misterios-da-vida-de-cristo"],
  },
  {
    n: 95,
    ccc: "495, 509",
    slug: "maria-mae-de-deus",
    module: CHRIST,
    title: "Maria, Mãe de Deus",
    question: "Por que Maria é verdadeiramente Mãe de Deus?",
    text: [
      "Maria é verdadeiramente Mãe de Deus porque é a mãe de Jesus.",
      "Aquele que foi concebido por obra do Espírito Santo e se tornou verdadeiramente Filho de Maria é o Filho eterno de Deus Pai. É Ele mesmo Deus.",
    ],
    quiz: "Por que a Igreja chama Maria de Mãe de Deus?",
    right: "Porque o filho que ela gerou é o Filho eterno de Deus Pai.",
    wrong: [
      "Porque ela existia antes de Deus.",
      "Porque foi mãe apenas da humanidade de Jesus, separada da sua divindade.",
    ],
    onWrong:
      "Maria é Mãe de Deus porque seu Filho é Deus: não porque tenha dado origem à divindade.",
    related: ["concilios/efeso", "apologetica/por-que-tantos-titulos-para-maria"],
  },
  {
    n: 96,
    ccc: "487–492, 508",
    slug: "imaculada-conceicao",
    module: CHRIST,
    title: "A Imaculada Conceição",
    question: "O que significa Imaculada Conceição?",
    text: [
      "Deus escolheu gratuitamente Maria, desde toda a eternidade, para que fosse a Mãe de seu Filho. Para cumprir essa missão, ela foi concebida imaculada.",
      "Isso significa que, pela graça de Deus e em previsão dos méritos de Jesus Cristo, Maria foi preservada do pecado original desde a sua concepção.",
    ],
    quiz: "O que afirma o dogma da Imaculada Conceição?",
    right: "Maria foi preservada do pecado original desde a sua concepção.",
    wrong: ["Jesus foi concebido sem pai humano.", "Maria não precisou da graça de Deus."],
    onWrong:
      "O dogma fala da concepção de Maria, preservada do pecado original pela graça e pelos méritos de Cristo.",
    related: ["nossa-senhora/imaculada-conceicao"],
  },
  {
    n: 126,
    ccc: "631, 638",
    slug: "ressurreicao-de-cristo",
    module: CHRIST,
    title: "A Ressurreição de Cristo",
    question: "Que lugar ocupa a Ressurreição de Cristo na nossa fé?",
    text: [
      "A Ressurreição de Jesus é a verdade culminante da nossa fé em Cristo.",
      "Com a Cruz, ela representa uma parte essencial do Mistério pascal.",
    ],
    quiz: "O que a Ressurreição de Jesus é para a nossa fé?",
    right: "A verdade culminante da fé em Cristo.",
    wrong: ["Um símbolo da esperança dos discípulos, sem fato real.", "Um detalhe secundário da vida de Jesus."],
    onWrong: "A Ressurreição é a verdade culminante da fé e, com a Cruz, parte essencial do Mistério pascal.",
    related: ["catecismo/ressurreicao-e-ascensao-de-cristo", "crisma/a-ressurreicao-de-cristo"],
  },
  {
    n: 132,
    ccc: "659–667",
    slug: "a-ascensao",
    module: CHRIST,
    title: "A Ascensão",
    question: "O que significa a Ascensão?",
    text: [
      "Passados os quarenta dias em que se mostrou aos Apóstolos, Cristo sobe ao céu e senta-se à direita do Pai.",
      "Ele é o Senhor que agora reina com a sua humanidade na glória eterna de Filho de Deus e sem cessar intercede por nós junto do Pai. Envia-nos o seu Espírito e nos dá a esperança de um dia ir ter com Ele.",
    ],
    quiz: "O que a Ascensão significa?",
    right: "Cristo sobe ao céu, reina com a sua humanidade e intercede por nós.",
    wrong: ["Jesus deixou de ser homem ao subir ao céu.", "Jesus abandonou os discípulos e não age mais."],
    onWrong:
      "Cristo reina com a sua humanidade na glória e sem cessar intercede por nós; envia-nos o seu Espírito.",
    related: ["catecismo/ressurreicao-e-ascensao-de-cristo", "jesus-cristo/ascensao-mv"],
  },
  {
    n: 136,
    ccc: "683–686",
    slug: "creio-no-espirito-santo",
    module: SPIRIT_CHURCH,
    title: "Creio no Espírito Santo",
    question: "O que a Igreja quer dizer quando professa: Creio no Espírito Santo?",
    text: [
      "Crer no Espírito Santo é professar a terceira Pessoa da Santíssima Trindade, que procede do Pai e do Filho e com o Pai e o Filho é adorado e glorificado.",
      "O Espírito foi enviado aos nossos corações (Gl 4,6) para recebermos a vida nova de filhos de Deus.",
    ],
    quiz: "Quem é o Espírito Santo?",
    right: "A terceira Pessoa da Santíssima Trindade, adorada com o Pai e o Filho.",
    wrong: ["Uma energia impessoal enviada por Deus.", "Uma criatura superior aos anjos."],
    onWrong:
      "O Espírito Santo é uma Pessoa divina, que com o Pai e o Filho é adorado e glorificado.",
    related: ["catecismo/creio-no-espirito-santo", "crisma/creio-no-espirito-santo"],
  },
  {
    n: 144,
    ccc: "731–732, 738",
    slug: "pentecostes",
    module: SPIRIT_CHURCH,
    title: "Pentecostes",
    question: "O que acontece no Pentecostes?",
    text: [
      "Cinquenta dias após a Ressurreição, Jesus Cristo glorificado infunde o Espírito em abundância e o manifesta como Pessoa divina, de modo que a Santíssima Trindade é plenamente revelada.",
      "A missão de Cristo e do Espírito torna-se a missão da Igreja, enviada a anunciar e difundir o mistério da comunhão trinitária.",
    ],
    quiz: "O que acontece no Pentecostes?",
    right: "Cristo glorificado infunde o Espírito em abundância, e a Trindade é plenamente revelada.",
    wrong: ["Jesus nasce em Belém.", "Jesus sobe ao céu diante dos Apóstolos."],
    onWrong:
      "No Pentecostes, cinquenta dias após a Ressurreição, Cristo infunde o Espírito e a missão passa à Igreja.",
    related: ["catecismo/creio-no-espirito-santo", "sacramentos/confirmacao"],
  },
  {
    n: 147,
    ccc: "751–752, 777, 804",
    slug: "o-que-e-a-igreja",
    module: SPIRIT_CHURCH,
    title: "O que é a Igreja",
    question: "O que significa a palavra Igreja?",
    text: [
      "Designa o povo que Deus convoca e reúne de todos os confins da terra.",
      "É a assembleia daqueles que, pela fé e pelo Batismo, se tornam filhos de Deus, membros de Cristo e templo do Espírito Santo.",
    ],
    quiz: "O que a palavra Igreja designa?",
    right: "O povo que Deus convoca e reúne de toda a terra.",
    wrong: ["Apenas o prédio onde se celebra a Missa.", "Somente o Papa e os bispos."],
    onWrong:
      "A Igreja é o povo que Deus convoca: todos os que, pela fé e pelo Batismo, são membros de Cristo.",
    related: ["catecismo/igreja-povo-de-deus-corpo-de-cristo-templo-do-espirito-santo", "catecismo/a-igreja-e-a-comunhao-dos-santos"],
  },
  {
    n: 166,
    ccc: "830–831, 868",
    slug: "por-que-catolica",
    module: SPIRIT_CHURCH,
    title: "Por que a Igreja é católica",
    question: "Por que a Igreja se chama católica?",
    text: [
      "A Igreja é católica, isto é, universal, porque nela está presente Cristo.",
      "Ela anuncia a totalidade e a integridade da fé, administra a plenitude dos meios de salvação e é enviada em missão a todos os povos, em todos os tempos e culturas.",
    ],
    quiz: "O que significa dizer que a Igreja é católica?",
    right: "Que é universal: nela está Cristo, e ela é enviada a todos os povos.",
    wrong: ["Que pertence apenas aos cristãos de Roma.", "Que é restrita a uma cultura e a uma época."],
    onWrong: "Católica significa universal: a Igreja é enviada a todos os povos, tempos e culturas.",
    related: ["catecismo/as-marcas-da-igreja", "crisma/a-igreja-e-catolica"],
  },
  {
    n: 174,
    ccc: "857, 869",
    slug: "por-que-apostolica",
    module: SPIRIT_CHURCH,
    title: "Por que a Igreja é apostólica",
    question: "Por que a Igreja é apostólica?",
    text: [
      "Pela sua origem, construída sobre o fundamento dos Apóstolos (Ef 2,20), e pelo ensino, que é o mesmo dos Apóstolos.",
      "E pela sua estrutura: até o regresso de Cristo, ela é instruída, santificada e governada pelos Apóstolos, graças aos seus sucessores, os Bispos em comunhão com o sucessor de Pedro.",
    ],
    quiz: "Por que a Igreja é chamada apostólica?",
    right: "Pela origem, pelo ensino e pela estrutura que vêm dos Apóstolos.",
    wrong: ["Porque só os Apóstolos do século I pertenciam a ela.", "Porque cada comunidade define o próprio ensino."],
    onWrong:
      "A Igreja é apostólica pela origem, pelo ensino e pela estrutura, por meio dos Bispos, sucessores dos Apóstolos.",
    related: ["catecismo/as-marcas-da-igreja", "crisma/a-igreja-e-apostolica"],
  },
  {
    n: 182,
    ccc: "881–882, 936–937",
    slug: "a-missao-do-papa",
    module: SPIRIT_CHURCH,
    title: "A missão do Papa",
    question: "Qual é a missão do Papa?",
    text: [
      "O Papa, Bispo de Roma e Sucessor de São Pedro, é o perpétuo e visível princípio e fundamento da unidade da Igreja.",
      "É o vigário de Cristo, cabeça do colégio dos Bispos e pastor de toda a Igreja.",
    ],
    quiz: "O que o Papa é para a Igreja?",
    right: "O princípio e fundamento visível da sua unidade.",
    wrong: ["Um chefe de Estado sem função religiosa.", "Um bispo sem relação com os demais."],
    onWrong:
      "O Papa, Sucessor de São Pedro, é o princípio visível da unidade e cabeça do colégio dos Bispos.",
    related: ["catecismo/constituicao-hierarquica-da-igreja"],
  },
  {
    n: 194,
    ccc: "946–953, 960",
    slug: "comunhao-dos-santos",
    module: SPIRIT_CHURCH,
    title: "A comunhão dos santos",
    question: "O que significa a expressão comunhão dos santos?",
    text: [
      "Indica, antes de tudo, a participação de todos os membros da Igreja nas coisas santas: a fé, os sacramentos, em especial a Eucaristia, os carismas e os outros dons espirituais.",
      "Na raiz da comunhão está a caridade, que move o fiel a colocar tudo em comum, mesmo os próprios bens materiais, a serviço dos pobres.",
    ],
    quiz: "O que a comunhão dos santos indica antes de tudo?",
    right: "A participação de todos os membros da Igreja nas coisas santas.",
    wrong: ["A lista dos santos canonizados.", "O ato de receber a comunhão em uma festa de santo."],
    onWrong:
      "É a participação de todos os membros da Igreja na fé, nos sacramentos e nos dons, com raiz na caridade.",
    related: ["catecismo/a-igreja-e-a-comunhao-dos-santos", "crisma/a-comunhao-dos-santos"],
  },
  {
    n: 207,
    ccc: "1020, 1051",
    slug: "vida-eterna",
    module: LAST_THINGS,
    title: "A vida eterna",
    question: "O que é a vida eterna?",
    text: [
      "A vida eterna é a que se iniciará imediatamente após a morte. Ela não terá fim.",
      "Será precedida, para cada um, por um juízo particular feito por Cristo, juiz dos vivos e dos mortos, e será confirmada pelo juízo final.",
    ],
    quiz: "Quando se inicia a vida eterna?",
    right: "Imediatamente após a morte, e ela não terá fim.",
    wrong: ["Depois de várias reencarnações.", "Apenas no fim do mundo, sem nada antes disso."],
    onWrong:
      "A vida eterna começa imediatamente após a morte, precedida pelo juízo particular.",
    related: ["novissimos/vida-eterna", "catecismo/ressurreicao-da-carne-e-vida-eterna"],
  },
  {
    n: 209,
    ccc: "1023–1026, 1053",
    slug: "o-ceu",
    module: LAST_THINGS,
    title: "O céu",
    question: "O que se entende por céu?",
    text: [
      "Por céu entende-se o estado de felicidade suprema e definitiva.",
      "Os que morrem na graça de Deus e não precisam de mais purificação são reunidos em torno de Jesus e de Maria, dos anjos e dos santos. Veem Deus face a face, vivem em comunhão de amor com a Santíssima Trindade e intercedem por nós.",
    ],
    quiz: "O que é o céu?",
    right: "O estado de felicidade suprema e definitiva, vendo Deus face a face.",
    wrong: ["Um lugar acima das nuvens, no espaço físico.", "Uma simples lembrança que fica de quem morreu."],
    onWrong: "O céu é o estado de felicidade suprema e definitiva, em comunhão de amor com a Trindade.",
    related: ["novissimos/vida-eterna", "catecismo/ressurreicao-da-carne-e-vida-eterna"],
  },
  {
    n: 210,
    ccc: "1030–1031, 1054",
    slug: "o-purgatorio",
    module: LAST_THINGS,
    title: "O purgatório",
    question: "O que é o purgatório?",
    text: [
      "O purgatório é o estado dos que morrem na amizade de Deus, mas, embora seguros da sua salvação eterna, ainda precisam de purificação para entrar na alegria de Deus.",
    ],
    quiz: "Quem está no purgatório?",
    right: "Os que morrem na amizade de Deus, mas ainda precisam de purificação.",
    wrong: ["Os condenados que podem ser condenados de novo.", "Os que ainda não sabem se serão salvos."],
    onWrong: "No purgatório estão os que já têm a salvação assegurada, mas precisam de purificação.",
    related: ["novissimos/purgatorio", "apologetica/por-que-purgatorio-nao-esta-na-biblia"],
  },
  {
    n: 212,
    ccc: "1033–1035, 1056–1057",
    slug: "o-inferno",
    module: LAST_THINGS,
    title: "O inferno",
    question: "Em que consiste o inferno?",
    text: [
      "Consiste na condenação eterna daqueles que, por escolha livre, morrem em pecado mortal.",
      "A pena principal do inferno é a eterna separação de Deus, o único em quem o homem encontra a vida e a felicidade para as quais foi criado e às quais aspira.",
    ],
    quiz: "Qual é a pena principal do inferno?",
    right: "A eterna separação de Deus.",
    wrong: ["O esquecimento de tudo o que se viveu.", "Uma punição passageira, que depois termina."],
    onWrong: "A pena principal do inferno é a eterna separação de Deus, para quem o homem foi criado.",
    related: ["novissimos/inferno"],
  },
  {
    n: 214,
    ccc: "1038–1041, 1058–1059",
    slug: "o-juizo-final",
    module: LAST_THINGS,
    title: "O juízo final",
    question: "Em que consistirá o juízo final?",
    text: [
      "O juízo final (universal) consistirá na sentença de vida bem-aventurada ou de condenação eterna, que o Senhor Jesus, no seu regresso como juiz dos vivos e dos mortos, pronunciará sobre justos e injustos, reunidos todos diante dele.",
      "Depois desse juízo, o corpo ressuscitado participará da retribuição que a alma teve no juízo particular.",
    ],
    quiz: "Quem pronunciará a sentença do juízo final?",
    right: "O Senhor Jesus, no seu regresso, como juiz dos vivos e dos mortos.",
    wrong: ["Cada pessoa, sobre si mesma.", "Os anjos, sem a presença de Cristo."],
    onWrong: "O juízo final é pronunciado por Cristo, no seu regresso, juiz dos vivos e dos mortos.",
    related: ["novissimos/juizo-final", "catecismo/ressurreicao-da-carne-e-vida-eterna"],
  },
  {
    n: 224,
    ccc: "1113–1131",
    slug: "os-sete-sacramentos",
    module: SACRAMENTS,
    title: "Os sete sacramentos",
    question: "O que são e quais são os sacramentos?",
    text: [
      "Os sacramentos são sinais sensíveis e eficazes da graça, instituídos por Cristo e confiados à Igreja, mediante os quais nos é concedida a vida divina.",
      "São sete: o Batismo, a Confirmação, a Eucaristia, a Penitência, a Unção dos Enfermos, a Ordem e o Matrimônio.",
    ],
    quiz: "O que são os sacramentos?",
    right: "Sinais sensíveis e eficazes da graça, instituídos por Cristo.",
    wrong: ["Apenas ritos simbólicos, criados pelas comunidades.", "Prêmios para quem já é santo."],
    onWrong:
      "Os sacramentos são sinais eficazes da graça, instituídos por Cristo; concedem de fato a vida divina.",
    related: ["crisma/os-sete-sacramentos-da-igreja", "catecismo/celebracao-do-misterio-cristao"],
  },
  {
    n: 263,
    ccc: "1262–1274, 1279–1280",
    slug: "efeitos-do-batismo",
    module: SACRAMENTS,
    title: "Os efeitos do Batismo",
    question: "Quais são os efeitos do Batismo?",
    text: [
      "O Batismo perdoa o pecado original, todos os pecados pessoais e as penas devidas ao pecado. Faz participar da vida divina trinitária mediante a graça santificante, incorpora em Cristo e na Igreja e confere as virtudes teologais e os dons do Espírito Santo.",
      "O batizado pertence para sempre a Cristo: é assinalado com o selo indelével de Cristo (caráter).",
    ],
    quiz: "Qual destes é um efeito do Batismo?",
    right: "Perdoa o pecado original e incorpora em Cristo e na Igreja.",
    wrong: ["Impede a pessoa de voltar a pecar.", "Precisa ser repetido a cada ano para valer."],
    onWrong:
      "O Batismo perdoa os pecados e imprime um selo indelével: por isso não se repete.",
    related: ["catecismo/o-sacramento-do-batismo", "sacramentos/batismo"],
  },
  {
    n: 268,
    ccc: "1302–1305, 1316–1317",
    slug: "efeito-da-confirmacao",
    module: SACRAMENTS,
    title: "O efeito da Confirmação",
    question: "Qual é o efeito da Confirmação?",
    text: [
      "O efeito da Confirmação é a efusão especial do Espírito Santo, como no Pentecostes. Essa efusão imprime na alma um caráter indelével e traz um crescimento da graça batismal.",
      "Enraíza mais profundamente na filiação divina, une mais firmemente a Cristo e à Igreja, revigora os dons do Espírito Santo e dá uma força especial para testemunhar a fé cristã.",
    ],
    quiz: "Qual é o efeito da Confirmação?",
    right: "A efusão especial do Espírito Santo, como no Pentecostes.",
    wrong: ["Apagar o Batismo e substituí-lo.", "Dar à pessoa o poder de celebrar a Missa."],
    onWrong:
      "A Confirmação aumenta a graça batismal, com a efusão especial do Espírito Santo.",
    related: ["catecismo/o-sacramento-da-confirmacao", "sacramentos/confirmacao"],
  },
  {
    n: 271,
    ccc: "1322–1323, 1409",
    slug: "o-que-e-a-eucaristia",
    module: SACRAMENTS,
    title: "O que é a Eucaristia",
    question: "O que é a Eucaristia?",
    text: [
      "É o próprio sacrifício do Corpo e do Sangue do Senhor Jesus, que Ele instituiu para perpetuar o sacrifício da cruz no decorrer dos séculos até o seu regresso, confiando à Igreja o memorial da sua Morte e Ressurreição.",
      "É o sinal da unidade, o vínculo da caridade, o banquete pascal, em que se recebe Cristo, a alma se enche de graça e nos é dado o penhor da vida eterna.",
    ],
    quiz: "O que é a Eucaristia?",
    right: "O sacrifício do Corpo e do Sangue de Jesus, memorial da sua Morte e Ressurreição.",
    wrong: ["Só uma refeição de lembrança, sem presença de Cristo.", "Um costume criado depois dos Apóstolos."],
    onWrong:
      "A Eucaristia foi instituída por Jesus para perpetuar o sacrifício da cruz; não é só uma lembrança.",
    related: ["catecismo/o-sacramento-da-eucaristia", "sacramentos/eucaristia"],
  },
  {
    n: 282,
    ccc: "1373–1375, 1413",
    slug: "presenca-real",
    module: SACRAMENTS,
    title: "A presença real de Jesus",
    question: "Como Jesus está presente na Eucaristia?",
    text: [
      "Jesus Cristo está presente na Eucaristia de modo único e incomparável: de modo verdadeiro, real e substancial, com o seu Corpo e o seu Sangue, com a sua Alma e a sua Divindade.",
      "Está presente em modo sacramental, sob as espécies eucarísticas do pão e do vinho: Cristo completo, Deus e homem.",
    ],
    quiz: "Como Jesus está presente na Eucaristia?",
    right: "De modo verdadeiro, real e substancial.",
    wrong: ["Apenas de modo simbólico.", "Apenas na memória de quem participa."],
    onWrong:
      "A presença de Cristo na Eucaristia é verdadeira, real e substancial; não só um símbolo ou lembrança.",
    related: ["primeira-comunhao/presenca-real", "apologetica/presenca-real-na-eucaristia-joao-6"],
  },
  {
    n: 283,
    ccc: "1376–1377, 1413",
    slug: "transubstanciacao",
    module: SACRAMENTS,
    title: "Transubstanciação",
    question: "O que significa transubstanciação?",
    text: [
      "Transubstanciação significa a conversão de toda a substância do pão na substância do Corpo de Cristo e de toda a substância do vinho na substância do seu Sangue.",
      "Ela se realiza na oração eucarística, pela eficácia da palavra de Cristo e pela ação do Espírito Santo. As características sensíveis do pão e do vinho permanecem inalteradas.",
    ],
    quiz: "O que acontece na transubstanciação?",
    right: "Toda a substância do pão e do vinho se converte no Corpo e no Sangue de Cristo.",
    wrong: ["O aspecto do pão e do vinho muda visivelmente.", "O pão e o vinho continuam sendo pão e vinho, só com novo significado."],
    onWrong:
      "A substância se converte no Corpo e no Sangue de Cristo; as características sensíveis permanecem inalteradas.",
    related: ["concilios/trento-decreto-sobre-a-eucaristia", "concilios/latrao-iv"],
  },
  {
    n: 303,
    ccc: "1450–1460, 1487–1492",
    slug: "atos-do-penitente",
    module: SACRAMENTS,
    title: "Os atos do penitente",
    question: "Quais são os atos do penitente?",
    text: [
      "São o exame de consciência diligente; a contrição, ou arrependimento, que inclui o propósito de não mais pecar; a confissão, que consiste na acusação dos pecados diante do sacerdote; e a satisfação.",
      "A satisfação é o cumprimento dos atos de penitência que o confessor impõe, para reparar o dano causado pelo pecado.",
    ],
    quiz: "Qual conjunto reúne os atos do penitente?",
    right: "Exame de consciência, contrição, confissão e satisfação.",
    wrong: ["Jejum, esmola e peregrinação.", "Só contar os pecados, sem arrependimento."],
    onWrong:
      "Os atos do penitente são o exame de consciência, a contrição, a confissão e a satisfação.",
    related: ["sacramentos/penitencia-reconciliacao", "primeira-comunhao/primeira-confissao"],
  },
  {
    n: 319,
    ccc: "1520–1523, 1532",
    slug: "uncao-dos-enfermos",
    module: SACRAMENTS,
    title: "A Unção dos Enfermos",
    question: "Quais são os efeitos da Unção dos Enfermos?",
    text: [
      "Confere uma graça especial que une mais intimamente o doente à Paixão de Cristo, dando-lhe conforto, paz, coragem e também o perdão dos pecados, se o doente não puder se confessar.",
      "Por vezes, se for a vontade de Deus, permite também a recuperação da saúde física. Em todo caso, prepara o doente para a passagem à Casa do Pai.",
    ],
    quiz: "Qual é um efeito da Unção dos Enfermos?",
    right: "Une o doente à Paixão de Cristo e lhe dá conforto, paz e coragem.",
    wrong: ["Garante sempre a cura física.", "Só serve para quem já morreu."],
    onWrong:
      "A Unção dá conforto, paz e coragem; a cura física pode vir, mas só se for a vontade de Deus.",
    related: ["sacramentos/uncao-dos-enfermos", "catecismo/a-uncao-dos-enfermos"],
  },
  {
    n: 322,
    ccc: "1536",
    slug: "sacramento-da-ordem",
    module: SACRAMENTS,
    title: "O sacramento da Ordem",
    question: "O que é o sacramento da Ordem?",
    text: [
      "É o sacramento graças ao qual a missão confiada por Cristo aos seus Apóstolos continua a ser exercida na Igreja, até o fim dos tempos.",
    ],
    quiz: "O que o sacramento da Ordem faz continuar na Igreja?",
    right: "A missão confiada por Cristo aos Apóstolos.",
    wrong: ["A vida consagrada de todo batizado.", "A autoridade civil das nações."],
    onWrong:
      "Pela Ordem, a missão que Cristo confiou aos Apóstolos continua a ser exercida na Igreja.",
    related: ["catecismo/o-sacramento-da-ordem", "sacramentos/ordem"],
  },
  {
    n: 338,
    ccc: "1659–1660",
    slug: "fins-do-matrimonio",
    module: SACRAMENTS,
    title: "Os fins do Matrimônio",
    question: "Para que fins Deus instituiu o Matrimônio?",
    text: [
      "A união matrimonial do homem e da mulher, fundada pelo Criador, está por sua natureza ordenada à comunhão e ao bem dos cônjuges e à geração e educação dos filhos.",
      "Segundo o desígnio originário de Deus, a união matrimonial é indissolúvel, como afirma Jesus: \"O que Deus uniu, o homem não separe\" (Mc 10,9).",
    ],
    quiz: "A que o Matrimônio está ordenado por natureza?",
    right: "Ao bem dos cônjuges e à geração e educação dos filhos.",
    wrong: ["Apenas a um contrato de bens entre as famílias.", "Somente ao bem de um dos cônjuges, enquanto durar o afeto."],
    onWrong:
      "O Matrimônio está ordenado ao bem dos cônjuges e aos filhos, e é indissolúvel pelo desígnio de Deus.",
    related: ["catecismo/o-sacramento-do-matrimonio", "sacramentos/matrimonio"],
  },
  {
    n: 363,
    ccc: "1730–1733, 1743–1744",
    slug: "a-liberdade",
    module: MORAL,
    title: "A liberdade",
    question: "O que é a liberdade?",
    text: [
      "É o poder, dado por Deus ao homem, de agir e não agir, de fazer isto ou aquilo, praticando assim, por si mesmo, ações deliberadas. Quanto mais faz o bem, mais alguém se torna livre.",
      "A liberdade atinge a perfeição quando é ordenada para Deus. Ela implica também a possibilidade de escolher entre o bem e o mal, mas a escolha do mal é um abuso da liberdade, que conduz à escravidão do pecado.",
    ],
    quiz: "Quando alguém se torna mais livre?",
    right: "Quanto mais faz o bem.",
    wrong: ["Quanto menos regras segue.", "Quando escolhe o mal por conta própria."],
    onWrong:
      "Quanto mais faz o bem, mais alguém se torna livre; a escolha do mal é um abuso da liberdade.",
    related: ["catecismo/a-liberdade-do-homem"],
  },
  {
    n: 372,
    ccc: "1776–1780, 1795–1797",
    slug: "consciencia-moral",
    module: MORAL,
    title: "A consciência moral",
    question: "O que é a consciência moral?",
    text: [
      "A consciência moral, presente no íntimo da pessoa, é um juízo da razão que, no momento oportuno, ordena ao homem que pratique o bem e evite o mal.",
      "Graças a ela, a pessoa percebe a qualidade moral de um ato, realizado ou a realizar, e pode assumir a responsabilidade. Quando a escuta, o homem prudente pode ouvir a voz de Deus que lhe fala.",
    ],
    quiz: "O que é a consciência moral?",
    right: "Um juízo da razão que ordena praticar o bem e evitar o mal.",
    wrong: ["Um simples sentimento que muda conforme o humor.", "Aquilo que a maioria das pessoas pensa."],
    onWrong:
      "A consciência é um juízo da razão, presente no íntimo da pessoa; não é um humor nem a opinião da maioria.",
    related: ["catecismo/a-consciencia-moral", "crisma/a-lei-moral-e-a-consciencia"],
  },
  {
    n: 379,
    ccc: "1805, 1834",
    slug: "virtudes-cardeais",
    module: MORAL,
    title: "As virtudes cardeais",
    question: "Quais são as virtudes humanas principais?",
    text: [
      "São as virtudes chamadas cardeais, que reagrupam todas as outras e constituem a base da vida virtuosa.",
      "São elas: prudência, justiça, fortaleza e temperança.",
    ],
    quiz: "Quais são as virtudes cardeais?",
    right: "Prudência, justiça, fortaleza e temperança.",
    wrong: ["Fé, esperança e caridade.", "Humildade, obediência e pobreza."],
    onWrong: "As cardeais são prudência, justiça, fortaleza e temperança; fé, esperança e caridade são as teologais.",
    related: ["catecismo/as-virtudes", "virtudes/prudencia"],
  },
  {
    n: 385,
    ccc: "1813",
    slug: "virtudes-teologais",
    module: MORAL,
    title: "As virtudes teologais",
    question: "Quais são as virtudes teologais?",
    text: ["As virtudes teologais são: fé, esperança e caridade."],
    quiz: "Quais são as virtudes teologais?",
    right: "Fé, esperança e caridade.",
    wrong: ["Prudência, justiça e fortaleza.", "Paciência, mansidão e bondade."],
    onWrong: "As teologais são fé, esperança e caridade; prudência, justiça e fortaleza estão entre as cardeais.",
    related: ["crisma/as-virtudes-teologais-e-cardeais", "virtudes/esperanca"],
  },
  {
    n: 392,
    ccc: "1849–1851, 1871–1872",
    slug: "o-que-e-o-pecado",
    module: MORAL,
    title: "O que é o pecado",
    question: "O que é o pecado?",
    text: [
      "É \"uma palavra, um ato ou um desejo contrários à Lei eterna\" (Santo Agostinho). É uma ofensa a Deus, na desobediência ao seu amor. Fere a natureza do homem e atenta contra a solidariedade humana.",
      "Cristo, na sua Paixão, revela plenamente a gravidade do pecado e o vence com a sua misericórdia.",
    ],
    quiz: "Como o pecado é definido?",
    right: "Uma palavra, um ato ou um desejo contrários à Lei eterna.",
    wrong: ["Apenas um erro que prejudica outra pessoa.", "Só o que a lei civil proíbe."],
    onWrong:
      "O pecado é uma ofensa a Deus: uma palavra, um ato ou um desejo contrários à Lei eterna.",
    related: ["catecismo/o-pecado", "catecismo/remissao-dos-pecados"],
  },
  {
    n: 395,
    ccc: "1855–1861, 1874",
    slug: "pecado-mortal",
    module: MORAL,
    title: "O pecado mortal",
    question: "Quando se comete o pecado mortal?",
    text: [
      "Comete-se pecado mortal quando, ao mesmo tempo, há matéria grave, plena consciência e deliberado consentimento.",
      "É perdoado ordinariamente mediante os sacramentos do Batismo e da Penitência ou Reconciliação.",
    ],
    quiz: "Quais condições, juntas, caracterizam o pecado mortal?",
    right: "Matéria grave, plena consciência e deliberado consentimento.",
    wrong: ["Qualquer falta cometida por distração.", "Só a matéria grave, mesmo sem saber nem querer."],
    onWrong:
      "As três condições precisam estar presentes ao mesmo tempo: matéria grave, plena consciência e deliberado consentimento.",
    related: ["pecados/pecado-mortal", "crisma/o-pecado-original-mortal-e-venial"],
  },
  {
    n: 436,
    ccc: "2056–2057",
    slug: "o-decalogo",
    module: MORAL,
    title: "O Decálogo",
    question: "O que significa Decálogo?",
    text: [
      "Decálogo significa \"dez palavras\" (Ex 34,28). Elas resumem a Lei dada por Deus ao povo de Israel, no contexto da Aliança, por meio de Moisés.",
      "Apresentam os mandamentos do amor a Deus (os três primeiros) e ao próximo (os outros sete) e traçam o caminho de uma vida liberta da escravidão do pecado.",
    ],
    quiz: "O que significa a palavra Decálogo?",
    right: "Dez palavras.",
    wrong: ["Dez reis.", "Livro da Lei."],
    onWrong: "Decálogo significa \"dez palavras\": os mandamentos do amor a Deus e ao próximo.",
    related: ["catecismo/o-decalogo-na-revelacao", "mandamentos/unidade-do-decalogo"],
  },
  {
    n: 452,
    ccc: "2174–2176, 2190–2191",
    slug: "o-domingo",
    module: MORAL,
    title: "O Domingo",
    question: "Por que, para os cristãos, o Sábado é substituído pelo Domingo?",
    text: [
      "Porque o Domingo é o dia da ressurreição de Cristo. Como primeiro dia da semana, evoca a primeira criação; como oitavo dia, significa a nova criação, inaugurada com a Ressurreição.",
      "Tornou-se assim, para os cristãos, o primeiro de todos os dias e de todas as festas: o dia do Senhor.",
    ],
    quiz: "Por que os cristãos guardam o Domingo?",
    right: "Porque é o dia da ressurreição de Cristo.",
    wrong: ["Porque é o único dia livre do trabalho.", "Porque foi o dia do nascimento de Jesus."],
    onWrong: "O Domingo é o dia do Senhor porque é o dia da ressurreição de Cristo.",
    related: ["mandamentos/participar-da-missa-dominical"],
  },
  {
    n: 466,
    ccc: "2258–2262, 2318–2320",
    slug: "respeitar-a-vida",
    module: MORAL,
    title: "Respeitar a vida humana",
    question: "Por que respeitar a vida humana?",
    text: [
      "Porque ela é sagrada. Desde o seu início, supõe a ação criadora de Deus e mantém-se para sempre numa relação especial com o Criador, seu único fim.",
      "A ninguém é lícito destruir diretamente um ser humano inocente, pois é um ato gravemente contrário à dignidade da pessoa e à santidade do Criador.",
    ],
    quiz: "Por que a vida humana deve ser respeitada?",
    right: "Porque é sagrada, desde o seu início.",
    wrong: ["Só quando a pessoa é considerada útil pela sociedade.", "Apenas a partir de certa idade."],
    onWrong:
      "A vida humana é sagrada desde o início, porque supõe a ação criadora de Deus.",
    related: ["catecismo/quinto-mandamento", "mandamentos/quinto-mandamento-md"],
  },
  {
    n: 521,
    ccc: "2464–2470, 2504",
    slug: "dever-da-verdade",
    module: MORAL,
    title: "O dever da verdade",
    question: "Qual o dever do homem em relação à verdade?",
    text: [
      "Toda pessoa é chamada à sinceridade e à veracidade no agir e no falar. Cada um tem o dever de procurar a verdade e de aderir a ela.",
      "Em Jesus Cristo, a verdade de Deus manifestou-se na sua totalidade. Segui-lo é viver do Espírito de verdade e evitar a duplicidade, a simulação e a hipocrisia.",
    ],
    quiz: "Qual é o dever de cada pessoa em relação à verdade?",
    right: "Procurar a verdade e aderir a ela, com sinceridade no agir e no falar.",
    wrong: ["Dizer a verdade só quando for conveniente.", "Considerar que cada um tem a sua, e nenhuma importa."],
    onWrong:
      "Cada um tem o dever de procurar a verdade e aderir a ela, evitando a duplicidade e a hipocrisia.",
    related: ["catecismo/oitavo-mandamento", "mandamentos/oitavo-mandamento-md"],
  },
];

const OPTION_IDS = ["a", "b", "c"] as const;

function build(entry: Entry, index: number): Lesson {
  // A posição da alternativa certa varia, para não virar sempre a mesma letra.
  const correctIndex = index % OPTION_IDS.length;
  const texts = [...entry.wrong];
  texts.splice(correctIndex, 0, entry.right);

  return {
    slug: entry.slug,
    module: entry.module,
    title: entry.title,
    subtitle: entry.question,
    review: "reviewed",
    indexable: false,
    concept: {
      title: entry.title,
      paragraphs: entry.text,
      highlights: [],
    },
    sources: [
      `Compêndio do Catecismo da Igreja Católica, n. ${entry.n}`,
      `Catecismo da Igreja Católica, n. ${entry.ccc}`,
    ],
    quiz: {
      question: entry.quiz,
      prompt: "Escolha a alternativa que expressa o ensinamento católico.",
      options: texts.map((text, position) => ({
        id: OPTION_IDS[position] as string,
        text,
      })),
      correctId: OPTION_IDS[correctIndex] as string,
      onCorrect: entry.text.join(" "),
      onWrong: entry.onWrong,
    },
    completion: {
      title: "Conceito compreendido.",
      text: `Você concluiu a lição sobre ${entry.title.toLowerCase()}. A aprendizagem continua com a leitura do artigo e dos documentos citados.`,
    },
    relatedEntries: entry.related.map((path) => {
      const [categoria, slug] = path.split("/") as [CategorySlug, string];
      return { categoria, slug };
    }),
  };
}

export const COMPENDIO_LESSONS: readonly Lesson[] = ENTRIES.map(build);
