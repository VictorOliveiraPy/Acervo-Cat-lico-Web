import type { CategorySlug } from "@/lib/schemas";

/**
 * Descrição de busca (meta description) de cada categoria, com 140 a 160 caracteres
 * e um convite à leitura. Separada dos rótulos porque só existe para buscadores.
 * Descreve o tema da categoria, sem afirmações doutrinais ou históricas próprias.
 */
export const CATEGORY_SEO_DESCRIPTION: Record<CategorySlug, string> = {
  santos:
    "Conheça a vida, a festa e o patronato de santos e santas canonizados pela Igreja Católica. Consulte biografias com fontes citadas em cada entrada.",
  papas:
    "Consulte a lista dos Papas, de São Pedro aos dias de hoje, com pontificado e contexto de cada um. Acompanhe a sucessão apostólica no acervo católico.",
  "milagres-eucaristicos":
    "Leia sobre milagres eucarísticos com culto e documentação eclesiástica reconhecidos: onde ocorreram, quando e o que a Igreja registra sobre cada caso.",
  catecismo:
    "Entenda as quatro partes do Catecismo da Igreja Católica e o que cada uma ensina. Consulte os temas em linguagem clara, com referência aos parágrafos.",
  crisma:
    "Prepare-se para a Crisma com temas de fé organizados com base no Catecismo: sacramentos, Espírito Santo e vida cristã. Consulte cada assunto por entrada.",
  historia:
    "Percorra a história da Igreja Católica em períodos amplos e didáticos, das origens aos dias atuais. Leia o contexto de cada época e dos seus eventos.",
  "doutores-igreja":
    "Conheça os Doutores da Igreja, santos cuja doutrina a Igreja reconhece como referência. Consulte a vida, as obras e o ensinamento de cada um deles.",
  concilios:
    "Consulte os concílios da Igreja, de Niceia ao Vaticano II: quando ocorreram, por que foram convocados e o que definiram sobre a fé. Leia cada resumo.",
  "nossa-senhora":
    "Conheça os dogmas marianos, as aparições aprovadas e os títulos de devoção a Nossa Senhora. Consulte a história e o significado de cada um no acervo.",
  livros:
    "Descubra clássicos da espiritualidade católica e obras de referência para a formação na fé. Consulte o autor, o contexto e o tema de cada livro.",
  oracoes:
    "Reze com as principais orações católicas e conheça a origem e o uso de cada uma. Consulte o texto completo do Pai-Nosso, da Ave-Maria e de muitas outras.",
  pecados:
    "Entenda os sete pecados capitais e a virtude que se opõe a cada um, segundo a doutrina católica. Consulte também outros temas sobre o pecado e a graça.",
  liturgia:
    "Entenda a Missa do Rito Romano parte por parte, a Confissão e a adoração ao Santíssimo. Consulte o sentido de cada rito da vida litúrgica da Igreja.",
  sacramentos:
    "Conheça os sete sacramentos da Igreja Católica: matéria, forma, ministro e efeitos de cada um. Consulte o que a doutrina ensina sobre cada sacramento.",
  virtudes:
    "Conheça as virtudes teologais e cardeais, os dons do Espírito Santo, as bem-aventuranças e as obras de misericórdia. Consulte cada uma no acervo católico.",
  mandamentos:
    "Leia os Dez Mandamentos comentados um a um e os preceitos da Igreja. Entenda o que cada mandamento pede e como é explicado na doutrina católica.",
  biblia:
    "Consulte os 73 livros do cânon católico da Bíblia, um a um: autor tradicional, contexto e tema de cada livro do Antigo e do Novo Testamento.",
  devocoes:
    "Conheça devoções católicas como a Via-Sacra, as novenas, o Sagrado Coração e o escapulário. Consulte a origem de cada prática e como vivê-la hoje.",
  glossario:
    "Consulte o glossário católico: termos litúrgicos, canônicos e devocionais explicados de forma direta. Tire suas dúvidas sobre o vocabulário da Igreja.",
  "calendario-liturgico":
    "Entenda o Ano Litúrgico da Igreja: tempos, cores, solenidades e datas móveis. Consulte o que cada período celebra e como ele se relaciona com os demais.",
  novissimos:
    "Morte, juízo, céu, inferno e purgatório: consulte o que a Igreja ensina sobre os novíssimos do homem, com explicações claras e referências em cada entrada.",
  "ordens-religiosas":
    "Conheça as principais ordens e congregações católicas: fundador, origem e carisma de cada uma. Consulte a história de franciscanos, beneditinos e outras.",
  "estrutura-igreja":
    "Do Papa à paróquia: entenda como a Igreja Católica se organiza e se governa. Consulte o papel de dioceses, bispos, cúria e outras instâncias da hierarquia.",
  santuarios:
    "Conheça os principais santuários e destinos de peregrinação católica no mundo. Consulte a história e a devoção ligadas a cada lugar antes de sua visita.",
  "documentos-magisterio":
    "Consulte encíclicas e constituições do Magistério da Igreja, com resumo e contexto de cada documento. Entenda do que tratam e quando foram publicados.",
  "beatos-canonizacao":
    "Entenda o processo de canonização, de Servo de Deus a Santo: cada etapa, os requisitos e o que muda em cada título. Consulte também beatos no acervo.",
  "igreja-brasil":
    "Percorra a história da Igreja no Brasil, da primeira Missa de 1500 à CNBB e à Teologia da Libertação. Consulte pessoas, fatos e contextos de cada época.",
  sacramentais:
    "Entenda os sacramentais: água benta, bênçãos, medalhas e outros sinais sagrados. Consulte o que são, como se usam e como diferem dos sete sacramentos.",
  apologetica:
    "Encontre respostas católicas a objeções clássicas sobre a fé e a prática da Igreja. Consulte cada tema com argumentos, contexto e fontes citadas.",
  "jesus-cristo":
    "Conheça os mistérios da vida de Cristo, seus títulos bíblicos e os dogmas sobre sua pessoa. Consulte o que a Igreja ensina sobre Jesus em cada entrada.",
  "personagens-biblicos":
    "Conheça patriarcas, profetas, reis e mulheres da Bíblia, além dos livros que contam suas histórias. Consulte quem foi cada personagem e o seu contexto.",
  parabolas:
    "Leia as parábolas dos Evangelhos com contexto e chave de interpretação. Consulte o que cada uma ensina e em que passagem bíblica ela pode ser encontrada.",
  "milagres-de-jesus":
    "Consulte os milagres de Jesus nos Evangelhos: curas, exorcismos, domínio sobre a natureza e ressurreições. Leia o contexto e o sentido de cada um deles.",
  "terra-santa":
    "Conheça os lugares da Palestina e de Israel ligados à vida de Cristo e à história bíblica. Consulte o que aconteceu em cada um e o seu significado.",
  "padres-da-igreja":
    "Conheça os Padres da Igreja, escritores dos primeiros séculos e testemunhas da fé apostólica. Consulte a vida, as obras e o contexto de cada um deles.",
  "heresias-cismas":
    "Entenda as principais heresias e cismas da história: os erros doutrinais, as rupturas de comunhão e a resposta da Igreja. Consulte o contexto de cada caso.",
  "anjos-demonios":
    "Conheça os arcanjos, os nove coros angélicos, o anjo da guarda e a doutrina sobre o demônio. Consulte o que a tradição católica ensina em cada entrada.",
  "doutrina-social":
    "Entenda a Doutrina Social da Igreja: dignidade da pessoa, bem comum, subsidiariedade e os demais princípios. Consulte cada tema com fontes do Magistério.",
  "liturgia-das-horas":
    "Conheça a Liturgia das Horas: Laudes, Vésperas, Completas e as demais horas do Ofício Divino. Consulte o que é cada uma e quando é rezada ao longo do dia.",
  "ritos-orientais":
    "Conheça os ritos orientais católicos: bizantino, maronita, copta, siro-malabar e outras Igrejas em comunhão com Roma. Consulte a origem de cada tradição.",
  "arte-sacra-simbolos":
    "Entenda símbolos e arte sacra da fé católica: IHS, Crismon, peixe, vestes litúrgicas e outros. Consulte a origem e o significado de cada um deles no acervo.",
  "direito-canonico":
    "Consulte temas de Direito Canônico: nulidade matrimonial, excomunhão, censuras e outros institutos jurídicos da Igreja, explicados em linguagem acessível.",
  "vocacoes-estados-de-vida":
    "Conheça as vocações na Igreja: matrimônio, vida consagrada, ministério ordenado e vida leiga como caminhos de santidade. Consulte o que define cada uma.",
  "primeira-comunhao":
    "Acompanhe uma trilha catequética de preparação para a Primeira Comunhão, com temas em ordem e linguagem acessível. Consulte cada etapa no acervo católico.",
  "musica-sacra":
    "Conheça o canto gregoriano e os grandes hinos latinos da tradição católica. Consulte a origem, o texto e o uso litúrgico de cada obra de música sacra.",
  cardeais:
    "Conheça cardeais da Igreja e o Colégio Cardinalício, de Roma ao conclave. Consulte a trajetória de cada cardeal e o papel que exercem na Igreja Católica.",
  "ciencia-fe":
    "Conheça cientistas católicos, instituições e o diálogo entre fé e razão ao longo da história. Consulte cada entrada para entender a relação entre ambas.",
  "missoes-evangelizacao":
    "Conheça missionários, ordens missionárias e a história da evangelização pelo mundo. Consulte quem foram, onde atuaram e como a fé chegou a cada região.",
  "catedrais-basilicas-mundo":
    "Conheça catedrais e basílicas católicas notáveis pela história e pela arquitetura. Consulte onde ficam, quando surgiram e o que torna cada templo único.",
};
